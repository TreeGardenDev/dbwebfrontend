'use client'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <div className="flex flex-col items-center justify-center gap-8">
            <a href="/add-table" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Add a table
            </a>
            <a href="/insert-records" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Insert Records
            </a>
            <a href="/view-edit-data" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              View and Edit Current Inspection Data
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}