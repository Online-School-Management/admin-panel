import { cn } from '@/lib/utils'

interface RichHtmlContentProps {
  /** Sanitized or trusted HTML (e.g. from Quill / Summernote-style editor). */
  html: string
  className?: string
}

/**
 * Renders HTML from rich-text editors with spacing that matches the editor preview.
 * Tailwind Preflight clears default `p`/`ul` margins; `prose` requires @tailwindcss/typography,
 * so we set explicit `[&_p]:mb-*` etc. instead.
 */
export function RichHtmlContent({ html, className }: RichHtmlContentProps) {
  return (
    <div
      className={cn(
        'text-base leading-relaxed text-foreground break-words',
        '[&_p]:mb-4 [&_p:last-child]:mb-0',
        '[&_h1]:mb-4 [&_h1]:mt-6 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:first:mt-0',
        '[&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:first:mt-0',
        '[&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:first:mt-0',
        '[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6',
        '[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6',
        '[&_li]:my-1',
        '[&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground/25 [&_blockquote]:pl-4 [&_blockquote]:italic',
        '[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2',
        '[&_strong]:font-semibold [&_em]:italic [&_u]:underline',
        '[&_pre]:my-4 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:text-sm',
        '[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm',
        '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
        '[&_img]:my-4 [&_img]:h-auto [&_img]:max-h-[min(70vh,28rem)] [&_img]:w-full [&_img]:max-w-full [&_img]:rounded-md [&_img]:object-contain',
        '[&_table]:my-4 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_table]:border-collapse',
        '[&_td]:border [&_td]:border-border [&_td]:p-2 [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:p-2',
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
