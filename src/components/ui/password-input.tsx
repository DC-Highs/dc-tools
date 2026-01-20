"use client"

import { PasswordInput as ArkPasswordInput } from "@ark-ui/react/password-input"
import { Eye, EyeOff } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

type PasswordInputProps = React.ComponentProps<"input">

export function PasswordInput({ className, ...props }: PasswordInputProps) {
    return (
        <ArkPasswordInput.Root className="w-full">
            <ArkPasswordInput.Control className="relative w-full">
                <ArkPasswordInput.Input
                    {...props}
                    className={cn(
                        `
            w-full
            h-9
            rounded-md
            border
            border-input
            bg-transparent
            px-2.5
            py-1
            pr-10
            text-base
            md:text-sm
            shadow-xs
            outline-none
            transition-[color,box-shadow]
            focus-visible:border-ring
            focus-visible:ring-[3px]
            focus-visible:ring-ring/50
            dark:bg-input/30
            `,
                        className,
                    )}
                />

                <ArkPasswordInput.VisibilityTrigger
                    className="
            absolute
            right-2.5
            top-1/2
            -translate-y-1/2
            text-muted-foreground
            hover:text-foreground
            transition-colors
          "
                >
                    <ArkPasswordInput.Indicator fallback={<EyeOff className="h-4 w-4" />}>
                        <Eye className="h-4 w-4" />
                    </ArkPasswordInput.Indicator>
                </ArkPasswordInput.VisibilityTrigger>
            </ArkPasswordInput.Control>
        </ArkPasswordInput.Root>
    )
}
