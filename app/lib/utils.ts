import { ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Teach tailwind-merge the custom font-size tokens, otherwise `text-label-m`
// is treated as a text colour and dropped next to `text-text-muted`.
const twMerge = extendTailwindMerge({
    classGroups: {
        'font-size': [
            {
                text: [
                    'display-xl',
                    'display-l',
                    'h1',
                    'h2',
                    'h3',
                    'body-l',
                    'body-m',
                    'label-m',
                    'mono-s',
                ],
            },
        ],
    },
})

export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs))
}
