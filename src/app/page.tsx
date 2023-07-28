 'use client'
 import { useState, useEffect } from 'react';
 import Image from 'next/image'
 import Link from 'next/link'
 import '@component/app/globals.css';

 export default function Home() {
  const [database, setDatabase] = useState('');

  useEffect(() => {
    const storedDatabase = localStorage.getItem('database');
    if (storedDatabase) {
      setDatabase(storedDatabase);
    } else {
      // Show the database name input screen
    }
  }, []);

  const handleDatabaseNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDatabase(event.target.value);
  };

  const handleDatabaseNameSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem('database', database);
    // Hide the database name input screen
  };
   return (
     <main className="flex min-h-screen flex-col items-center justify-between p-24">
       <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
         <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
           <div className="flex flex-col items-center justify-center gap-8">
            <form onSubmit={handleDatabaseNameSubmit}>
              <label>
                Database Name:
                <input type="text" value={database} onChange={handleDatabaseNameChange} />
              </label>
              <button type="submit">Save</button>
            </form>
            <Link href="/add-table" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Add a table
              </Link>
             <Link href="/insert-records" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
               Insert Records
             </Link>
             <Link href="/view-edit-data" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
               View and Edit Current Inspection Data
             </Link>
           </div>
         </div>
       </div>
     </main>
   );
 }