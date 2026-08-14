import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { Tooltip } from './Tooltip'

interface FieldWrapProps {
  label: string
  htmlFor?: string
  children: ReactNode
  hint?: string
  required?: boolean
  tooltip?: string
}

export function Field({ label, htmlFor, children, hint, required, tooltip }: FieldWrapProps) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="field-label flex items-center gap-1.5">
        <span>{label}</span>
        {required === true && (
          <span className="font-semibold text-red-500" aria-label="obligatorio">
            *
          </span>
        )}
        {required === false && (
          <span className="text-xs font-normal text-ink-400">(opcional)</span>
        )}
        {tooltip && <Tooltip text={tooltip} />}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-400">{hint}</span>}
    </label>
  )
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`field-input ${props.className ?? ''}`} />
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`field-input ${props.className ?? ''}`} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`field-input ${props.className ?? ''}`} />
}
