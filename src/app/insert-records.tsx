import { useState, useEffect } from 'react';

interface Column {
  name: string;
  dataType: string;
}

interface TableSchema {
  columns: Column[];
}

export default function InsertRecords() {
  const [database, setDatabase] = useState('');
  const [table, setTable] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [tableSchema, setTableSchema] = useState<TableSchema | null>(null);
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    // Fetch the table schema from the server
    const fetchTableSchema = async () => {
      try {
        const response = await fetch(`http://localhost:8080/querytableschema/${database}&table=${table}&apikey=${apiKey}`);
        if (response.ok) {
          const tableSchema = await response.json();
          setTableSchema(tableSchema);
        } else {
          console.error('Failed to fetch table schema:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch table schema:', error);
      }
    };

    if (database && table && apiKey) {
      fetchTableSchema();
    }
  }, [database, table, apiKey]);

  const handleDatabaseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDatabase(event.target.value);
  };

  const handleTableChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTable(event.target.value);
  };

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(event.target.value);
  };

  const handleAddRecord = () => {
    setRecords([...records, {}]);
  };

  const handleDeleteRecord = (index: number) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  const handleRecordChange = (index: number, column: string, value: any) => {
    setRecords((prevRecords) =>
      prevRecords.map((record, i) => {
        if (i === index) {
          return { ...record, [column]: value };
        }
        return record;
      })
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Create the JSON object
    const jsonObject = {
      records,
    };

    // Send the HTTP request with the JSON body
    try {
      const response = await fetch(`http://localhost:8080/insert/${database}&table=${table}&apikey=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonObject),
      });

      if (response.ok) {
        console.log('Records inserted successfully!');
      } else {
        console.error('Failed to insert records:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to insert records:', error);
    }
  };

  if (!tableSchema) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Insert Records</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Database:
          <input type="text" value={database} onChange={handleDatabaseChange} />
        </label>
        <label>
          Table:
          <input type="text" value={table} onChange={handleTableChange} />
        </label>
        <label>
          API Key:
          <input type="text" value={apiKey} onChange={handleApiKeyChange} />
        </label>
        {records.map((record, index) => (
          <div key={index}>
            {tableSchema.columns.map((column) => (
              <label key={column.name}>
                {column.name} ({column.dataType}):
                <input
                  type="text"
                  value={record[column.name] || ''}
                  onChange={(event) => handleRecordChange(index, column.name, event.target.value)}
                />
              </label>
            ))}
            <button type="button" onClick={() => handleDeleteRecord(index)}>
              Delete
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddRecord}>
          Add Record
        </button>
        <button type="submit">Insert Records</button>
      </form>
    </div>
  );
}