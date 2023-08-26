'use client'
import csvtojson from 'csvtojson';
 import { useState, useEffect, SetStateAction } from 'react';
 import Image from 'next/image';
 import Link from 'next/link';
 import '@component/app/globals.css';
export default function BulkUpload() {
  const [table, setTable] = useState('');
  interface TableSchema {
    columns: {
      name: string;
      type: string;
    }[];
  }

  interface TableSchema {
    columns: {
      name: string;
      type: string;
    }[];
  }

  const [tableSchema, setTableSchema] = useState<TableSchema | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [tables, setTables] = useState<string[]>([]);
  const [parsedData, setParsedData] = useState<{ [key: string]: string }[]>([]);

  useEffect(() => {
    // Fetch the tables from local storage
    const fetchTables = async () => {
      const tablesString = localStorage.getItem('tables');

      if (tablesString) {
        let tables = JSON.parse(tablesString);
        //do not show tables that end with _GPS
        tables = tables.filter((table: string) => !table.endsWith('_GPS'));
        setTables(tables);
      }
    };

    fetchTables();
  }, []);

  useEffect(() => {
    // Fetch the table schema from local storage
const fetchTableSchema = async () => {
  const columnsString = localStorage.getItem(`${table}_columns`);
  const typesString = localStorage.getItem(`${table}_types`);
  const recordsString = localStorage.getItem(`${table}_records`);
  //console.log(recordsString);
  const database = localStorage.getItem('database');
  const apiKey = localStorage.getItem('storedapikey');
  const uploadurl = `/upload/${table}`;


  if (columnsString && typesString && recordsString) {
    const columns = JSON.parse(columnsString);
    const types = JSON.parse(typesString);
    let recordarray: SetStateAction<any[]> = [];
    let records = JSON.parse(recordsString);
    //turn into array
    //for (let i = 0; i < records.length; i++) {
    //    recordarray.push(records[i]);
    //    }
    Object.keys(records).forEach((index: any) => {
        //console.log(records[index]);
        recordarray.push(records[index]);
        });

        
        
    //for (let i = 0; i < records.length; i++) {
    //  recordarray.push(records[i]);
    //}

    //if (!Array.isArray(records)) {
    //  records = [];
    //}
    //console.log(records);

    const tableSchema = {
      columns: columns.map((name: any, index: any) => ({
        name,
        type: types,
      })),
    };

    setTableSchema(tableSchema);
    setRecords(recordarray);
  }
};
    if (table) {
      fetchTableSchema();
    }
  }, [table]);


  const handleTableChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTable(event.target.value);
    const uploadurl = `/upload/${event.target.value}`;
  };
  const attachCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    file?.text().then((csv) => {
            //strip out the header row
              const parsedRows = parseCSV(csv);
              console.log(parsedRows);
              setParsedData(parsedRows);
                
        });
        
    }

    const parseCSV = async (csv: string) => {
      const rows = await csvtojson().fromString(csv);
      console.log(rows);
      let columnNames= localStorage.getItem(`${table}_columns`);
      //columnNames= JSON.parse(columnNames);
      columnNames = JSON.parse(columnNames).filter((columnName: string) => columnName !== 'INTERNAL_PRIMARY_KEY');
      console.log(columnNames);
      //const columnNames = JSON.parse(localStorage.getItem('columnNames') || '[]');
      const parsedRows = rows.map((row) => {
        const parsedRow: { [key: string]: string } = {};
      //  console.log(columnNames);
        columnNames.forEach((columnName) => {
          parsedRow[columnName] = row[columnName];
        });
        return parsedRow;
     });
     console.log(parsedRows);
      return parsedRows; 
    }






  const handleSubmit = async () => {
    
    let apiKey = localStorage.getItem('storedapikey');
    let database = localStorage.getItem('database');
    let postdata = [];
    console.log(parsedData);
    const records = await parsedData;
    console.log(records);



    try {
      const response = await fetch(`http://localhost:8080/insert/${database}&table=${table}&apikey=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(records)
      });
      if (response.ok) {
        console.log('Records inserted successfully');
      } else {
        console.error('Failed to insert records:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to insert records:', error);
    }
  };

  return (
    <div>
      <h1>Insert Records</h1>
      <form>
        <br />
        <label>
          Table:
          <select value={table}  onChange={handleTableChange}>
            <option value="">Select a table</option>
            {tables.map((table) => (
              <option key={table} value={table}>
                {table}
              </option>
            ))}
          </select>
        </label>
        <input type="file" name="file" onChange={attachCSV} />
        <br />
        <br />
        <br />
        <button type="button" onClick={handleSubmit}>
          Submit
        </button>
        
      </form>
      <br/>
      <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      return to home
    </Link>
    </div>
  );
}
