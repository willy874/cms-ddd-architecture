'use client'
import { fetchTest, useTestQuery } from '@/services/auth/test'
import { fetchSearch, useSearchQuery } from '@/services/auth/search'

export default function Button() {
  useTestQuery()
  useSearchQuery()
  return (
    <>
      <button
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        onClick={async () => {
          console.log('fetchSearch', await fetchSearch())
        }}
      >
        <span>fetchSearch</span>
      </button>
      <button
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        onClick={async () => {
          console.log('fetchTest', await fetchTest())
        }}
      >
        <span>fetchTest</span>
      </button>
    </>
  )
}
