 'use client'
 import { useState, useEffect } from 'react';
 import Image from 'next/image'
 import Link from 'next/link'
 import '@component/app/globals.css';
import { forEachChild } from 'typescript';

 export default function Home() {
  const [database, setDatabase] = useState('');
  const [connectionKey, setConnectionKey] = useState('');
  const [storedapikey, setStoredApiKey] = useState('');
  const [dbschema, setdbschema] = useState('');
    interface ParsedSchema {
      [key: string]: {
        table_name: string;
        columns: Array<string>;
        constraint_column:string;
        constraints:string;
        table_schema:string;
        types:Array<string>;
      };
    }

  useEffect(() => {
    const storedDatabase = localStorage.getItem('database');
    if (storedDatabase) {
      setDatabase(storedDatabase);
    } else {
      // Show the database name input screen
    }
    const storedconnectionKey = localStorage.getItem('connectionKey');
    if (storedconnectionKey) {
      setConnectionKey(connectionKey);
    } else {

    }
    const storedApiKey = localStorage.getItem('storedapikey');
    if (storedApiKey) {
      setStoredApiKey(storedApiKey);
    } else {
    }
    const storedDBSchema = localStorage.getItem('dbschema');
    if (storedDBSchema) {
        setdbschema(storedDBSchema);
    } else {
    }
  }, []);
  const BuildTable=(tableName:string, fulltable:Object)=>{
        //build table from Interfa  
        localStorage.setItem(`${tableName}`, JSON.stringify(fulltable));
        console.log(fulltable);
        //
    }

  
  const parseDBSchema = (dbschema: string) => {
    const dbschemaString = localStorage.getItem('dbschema');
    dbschemaString ? JSON.parse(dbschemaString) : null;

    return dbschemaString;
    };

  const handleDatabaseNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDatabase(event.target.value);
  };
  const handleConnectionKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConnectionKey(event.target.value);
  };
    const handleDBSchemaDownload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let connectionKey= localStorage.getItem('connectionKey');
    let url=`http://localhost:8080/querydatabase/${database}&expand=true&apikey=${connectionKey}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'text/json',
            }
        });
    let json = await response.json();
    localStorage.setItem('dbschema', JSON.stringify(json));
    console.log(json);
    return json;
    };

  const handleDatabaseNameSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    localStorage.setItem('database', database);
    localStorage.setItem('connectionKey', connectionKey);

    let url=`http://localhost:8080/getkey/${database}&apikey=${connectionKey}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }  
    });
    let json = await response.json();
    localStorage.setItem('storedapikey', json.APIKey);

    const dbshema = await handleDBSchemaDownload(event);
    console.log(dbshema);
    const dbschemaString = localStorage.getItem('dbschema');

    const parsed: ParsedSchema | null = dbschemaString ? JSON.parse(dbschemaString) : null;

    if (parsed) {
    Object.keys(parsed).forEach((table) => {
      const tabledet = parsed[table];

      const tablename=tabledet.table_name;
      console.log(`Table Name: ${tablename}`);
      BuildTable(tablename, tabledet);
   //     Object.values(tabledet.columns).forEach((column) => {
   //         console.log(`Column Name: ${column}`);
   // });
   //     Object.values(tabledet.types).forEach((type) => {
   //         console.log(`Column Type: ${type}`);
   //         
   //         });
    
    });
  };
  }

   
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
              <label>
                Connection Key:
                <input type="text" value={connectionKey} onChange={handleConnectionKeyChange} />
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
