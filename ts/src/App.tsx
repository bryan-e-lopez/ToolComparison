import React, { useState } from 'react';
import './App.css';

const callApi = (endpoint: RequestInfo | URL, setResponse: React.Dispatch<React.SetStateAction<string>>) => {
    fetch(endpoint)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return response.json(); // Parse JSON if it's a JSON response
        } else {
          return response.text(); // Handle non-JSON responses
        }
      })
      .then(data => {
        console.log(data);
        setResponse(typeof data === 'object' ? JSON.stringify(data) : data); // Convert objects to JSON strings, otherwise use text
      })
      .catch(error => {
        console.error('Error:', error);
        setResponse('Error occurred: ' + error.message); // Set error message with more detail
      });
  };
  

function App() {
  // Rust state variables
  const [rustNumber, setRustNumber] = useState('');
  const [rustHelloWorldResponse, setRustHelloWorldResponse] = useState('Nothing yet');
  const [rustFibonacciResponse, setRustFibonacciResponse] = useState('Nothing yet');
  const [rustConcurrencyResponse, setRustConcurrencyResponse] = useState('Nothing yet');

  // Java state variables
  const [javaNumber, setJavaNumber] = useState('');
  const [javaHelloWorldResponse, setJavaHelloWorldResponse] = useState('Nothing yet');
  const [javaFibonacciResponse, setJavaFibonacciResponse] = useState('Nothing yet');
  const [javaConcurrencyResponse, setJavaConcurrencyResponse] = useState('Nothing yet');

  // Rust API handlers
  const handleRustHelloWorld = () => {
    callApi('http://localhost:7000/', setRustHelloWorldResponse);
  };

  const handleRustFibonacci = () => {
    callApi(`http://localhost:7000/fibonacci/${rustNumber}`, setRustFibonacciResponse);
  };

  const handleRustConcurrency = () => {
    callApi(`http://localhost:7000/concurrency/${rustNumber}`, setRustConcurrencyResponse);
  };

  // Java API handlers
  const handleJavaHelloWorld = () => {
    callApi('http://localhost:8080/', setJavaHelloWorldResponse);
  };

  const handleJavaFibonacci = () => {
    callApi(`http://localhost:8080/fibonacci/${javaNumber}`, setJavaFibonacciResponse);
  };

  const handleJavaConcurrency = () => {
    callApi(`http://localhost:8080/concurrency/${javaNumber}`, setJavaConcurrencyResponse);
  };

  return (
    <div className="container">
      <div className="leftPane">
        <img
          src="https://www.rust-lang.org/static/images/rust-logo-blk.svg"
          alt="Rust Logo"
          className="logo"
        />
        <button onClick={handleRustHelloWorld} className="button">
          Hello World!
        </button>
        <p>Response: {rustHelloWorldResponse}</p>

        <p>→ This form field controls 'size' for the next two functions:</p>
        <input
          type="number"
          value={rustNumber}
          onChange={(e) => setRustNumber(e.target.value)}
          placeholder="Enter number"
          className="input"
        />        

        <button onClick={handleRustFibonacci} className="button">
          Fibonacci
        </button>
        <p>Response: {rustFibonacciResponse}</p>

        <button onClick={handleRustConcurrency} className="button">
          Concurrency
        </button>
        <p>Response: {rustConcurrencyResponse}</p>
      </div>

      <div className="rightPane">
        <img
          src="https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg"
          alt="Java Logo"
          className="logo"
        />
        <button onClick={handleJavaHelloWorld} className="button">
          Hello World!
        </button>
        <p>Response: {javaHelloWorldResponse}</p>

        <p>→ This form field controls 'size' for the next two functions:</p>
        <input
          type="number"
          value={javaNumber}
          onChange={(e) => setJavaNumber(e.target.value)}
          placeholder="Enter number"
          className="input"
        />

        <button onClick={handleJavaFibonacci} className="button">
          Fibonacci
        </button>
        <p>Response: {javaFibonacciResponse}</p>

        <button onClick={handleJavaConcurrency} className="button">
          Concurrency
        </button>
        <p>Response: {javaConcurrencyResponse}</p>
      </div>
    </div>
  );
}

export default App;
