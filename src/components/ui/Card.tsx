/**
 * Card - Reusable card component
 * @module components/ui
 */

import React from 'react';
import { View, Text } from 'react-native';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <View
      className={`
        bg-white
        rounded-2xl
        shadow-lg
        p-6
        ${className}
      `}
    >
      {children}
    </View>
  );
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <View
      className={`
        mb-4
        pb-4
        border-b
        border-gray-200
        ${className}
      `}
    >
      {children}
    </View>
  );
}

export interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <Text
      className={`
        text-xl
        font-bold
        text-gray-900
        ${className}
      `}
    >
      {children}
    </Text>
  );
}

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return (
    <View
      className={`
        ${className}
      `}
    >
      {children}
    </View>
  );
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <View
      className={`
        mt-4
        pt-4
        border-t
        border-gray-200
        ${className}
      `}
    >
      {children}
    </View>
  );
}
