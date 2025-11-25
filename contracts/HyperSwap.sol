// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title HyperSwap
 * @dev Decentralized exchange with automated market maker
 */
contract HyperSwap is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    struct Pool {
        address tokenA;
        address tokenB;
        uint256 reserveA;
        uint256 reserveB;
        uint256 totalLiquidity;
        uint256 feePercentage; // in basis points
    }

    struct Position {
        uint256 liquidity;
        uint256 rewardDebt;
    }

    mapping(bytes32 => Pool) public pools;
    mapping(bytes32 => mapping(address => Position)) public positions;
    mapping(address => bool) public supportedTokens;
    
    bytes32[] public poolIds;
    uint256 public constant FEE_DENOMINATOR = 10000;
    uint256 public protocolFee = 30; // 0.3%
    address public feeCollector;

    event PoolCreated(bytes32 indexed poolId, address tokenA, address tokenB);
    event LiquidityAdded(bytes32 indexed poolId, address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity);
    event LiquidityRemoved(bytes32 indexed poolId, address indexed provider, uint256 amountA, uint256 amountB, uint256 liquidity);
    event Swap(bytes32 indexed poolId, address indexed trader, address tokenIn, uint256 amountIn, uint256 amountOut);
    event FeeCollected(address indexed token, uint256 amount);

    constructor(address _feeCollector) {
        require(_feeCollector != address(0), "Invalid fee collector");
        feeCollector = _feeCollector;
    }

    /**
     * @dev Create new liquidity pool
     */
    function createPool(
        address tokenA,
        address tokenB,
        uint256 feePercentage
    ) external onlyOwner returns (bytes32) {
        require(tokenA != address(0) && tokenB != address(0), "Invalid tokens");
        require(tokenA != tokenB, "Same token");
        require(feePercentage <= 1000, "Fee too high"); // Max 10%

        bytes32 poolId = _getPoolId(tokenA, tokenB);
        require(pools[poolId].tokenA == address(0), "Pool exists");

        pools[poolId] = Pool({
            tokenA: tokenA,
            tokenB: tokenB,
            reserveA: 0,
            reserveB: 0,
            totalLiquidity: 0,
            feePercentage: feePercentage
        });

        poolIds.push(poolId);
        supportedTokens[tokenA] = true;
        supportedTokens[tokenB] = true;

        emit PoolCreated(poolId, tokenA, tokenB);
        return poolId;
    }

    /**
     * @dev Add liquidity to pool
     */
    function addLiquidity(
        bytes32 poolId,
        uint256 amountA,
        uint256 amountB
    ) external nonReentrant whenNotPaused returns (uint256 liquidity) {
        Pool storage pool = pools[poolId];
        require(pool.tokenA != address(0), "Pool not found");
        require(amountA > 0 && amountB > 0, "Invalid amounts");

        // Transfer tokens
        IERC20(pool.tokenA).safeTransferFrom(msg.sender, address(this), amountA);
        IERC20(pool.tokenB).safeTransferFrom(msg.sender, address(this), amountB);

        // Calculate liquidity
        if (pool.totalLiquidity == 0) {
            liquidity = _sqrt(amountA * amountB);
        } else {
            liquidity = _min(
                (amountA * pool.totalLiquidity) / pool.reserveA,
                (amountB * pool.totalLiquidity) / pool.reserveB
            );
        }

        require(liquidity > 0, "Insufficient liquidity");

        // Update pool
        pool.reserveA += amountA;
        pool.reserveB += amountB;
        pool.totalLiquidity += liquidity;

        // Update position
        positions[poolId][msg.sender].liquidity += liquidity;

        emit LiquidityAdded(poolId, msg.sender, amountA, amountB, liquidity);
    }

    /**
     * @dev Remove liquidity from pool
     */
    function removeLiquidity(
        bytes32 poolId,
        uint256 liquidity
    ) external nonReentrant returns (uint256 amountA, uint256 amountB) {
        Pool storage pool = pools[poolId];
        require(pool.tokenA != address(0), "Pool not found");
        require(liquidity > 0, "Invalid liquidity");
        require(positions[poolId][msg.sender].liquidity >= liquidity, "Insufficient liquidity");

        // Calculate amounts
        amountA = (liquidity * pool.reserveA) / pool.totalLiquidity;
        amountB = (liquidity * pool.reserveB) / pool.totalLiquidity;

        require(amountA > 0 && amountB > 0, "Insufficient amounts");

        // Update pool
        pool.reserveA -= amountA;
        pool.reserveB -= amountB;
        pool.totalLiquidity -= liquidity;

        // Update position
        positions[poolId][msg.sender].liquidity -= liquidity;

        // Transfer tokens
        IERC20(pool.tokenA).safeTransfer(msg.sender, amountA);
        IERC20(pool.tokenB).safeTransfer(msg.sender, amountB);

        emit LiquidityRemoved(poolId, msg.sender, amountA, amountB, liquidity);
    }

    /**
     * @dev Swap tokens
     */
    function swap(
        bytes32 poolId,
        address tokenIn,
        uint256 amountIn,
        uint256 minAmountOut
    ) external nonReentrant whenNotPaused returns (uint256 amountOut) {
        Pool storage pool = pools[poolId];
        require(pool.tokenA != address(0), "Pool not found");
        require(amountIn > 0, "Invalid amount");
        require(tokenIn == pool.tokenA || tokenIn == pool.tokenB, "Invalid token");

        bool isTokenA = tokenIn == pool.tokenA;
        uint256 reserveIn = isTokenA ? pool.reserveA : pool.reserveB;
        uint256 reserveOut = isTokenA ? pool.reserveB : pool.reserveA;
        address tokenOut = isTokenA ? pool.tokenB : pool.tokenA;

        // Calculate amount out with fee
        uint256 amountInWithFee = amountIn * (FEE_DENOMINATOR - pool.feePercentage);
        amountOut = (amountInWithFee * reserveOut) / (reserveIn * FEE_DENOMINATOR + amountInWithFee);
        
        require(amountOut >= minAmountOut, "Slippage exceeded");
        require(amountOut > 0, "Insufficient output");

        // Transfer tokens
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenOut).safeTransfer(msg.sender, amountOut);

        // Update reserves
        if (isTokenA) {
            pool.reserveA += amountIn;
            pool.reserveB -= amountOut;
        } else {
            pool.reserveB += amountIn;
            pool.reserveA -= amountOut;
        }

        emit Swap(poolId, msg.sender, tokenIn, amountIn, amountOut);
    }

    /**
     * @dev Get pool ID
     */
    function _getPoolId(address tokenA, address tokenB) private pure returns (bytes32) {
        return tokenA < tokenB 
            ? keccak256(abi.encodePacked(tokenA, tokenB))
            : keccak256(abi.encodePacked(tokenB, tokenA));
    }

    /**
     * @dev Square root function
     */
    function _sqrt(uint256 x) private pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }

    /**
     * @dev Min function
     */
    function _min(uint256 a, uint256 b) private pure returns (uint256) {
        return a < b ? a : b;
    }

    /**
     * @dev Update protocol fee
     */
    function updateProtocolFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee too high");
        protocolFee = newFee;
    }

    /**
     * @dev Update fee collector
     */
    function updateFeeCollector(address newCollector) external onlyOwner {
        require(newCollector != address(0), "Invalid collector");
        feeCollector = newCollector;
    }

    /**
     * @dev Pause swaps
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause swaps
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @dev Get pool count
     */
    function getPoolCount() external view returns (uint256) {
        return poolIds.length;
    }
}
