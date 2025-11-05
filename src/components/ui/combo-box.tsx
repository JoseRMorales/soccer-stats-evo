'use client'

import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type ComboboxOption = {
  value: string
  label: string
}

const Combobox = ({
  options,
  selected,
  setSelected,
  placeholder = 'Select option',
  searchPlaceholder = 'Search option...',
  notFoundText = 'No option found.',
}: {
  options: ComboboxOption[]
  selected: string
  setSelected: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  notFoundText?: string
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            'w-full justify-between',
            !selected && 'text-muted-foreground',
          )}
        >
          {selected
            ? options.find((option) => option.value === selected)?.label ||
              selected
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{notFoundText}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  value={option.value}
                  key={option.value}
                  onSelect={() => {
                    setSelected(option.value)
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      option.value === selected ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default Combobox
