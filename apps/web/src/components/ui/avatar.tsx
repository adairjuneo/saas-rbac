'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as React from 'react';

import { cn } from '@/lib/utils';

interface AvatarProps extends React.ComponentProps<'span'> {
  ref?: React.ForwardedRef<HTMLSpanElement>;
}

const Avatar = ({ ref, className, ...props }: AvatarProps) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
      className
    )}
    {...props}
  />
);

Avatar.displayName = AvatarPrimitive.Root.displayName;

interface AvatarImageProps extends React.ComponentProps<'img'> {
  ref?: React.ForwardedRef<HTMLImageElement>;
}

const AvatarImage = ({ ref, className, ...props }: AvatarImageProps) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
);

AvatarImage.displayName = AvatarPrimitive.Image.displayName;

interface AvatarFallbackProps extends React.ComponentProps<'span'> {
  ref?: React.ForwardedRef<HTMLSpanElement>;
}

const AvatarFallback = ({ ref, className, ...props }: AvatarFallbackProps) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className
    )}
    {...props}
  />
);

AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarFallback, AvatarImage };
