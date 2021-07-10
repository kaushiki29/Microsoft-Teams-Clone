import React from 'react'
import { render, fireEvent, waitFor, screen, } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import LoginComp from './screen/LoginComp';





test('Checks render login component',async ()=>{
  render(<LoginComp />)
  expect(screen.getByText('Sign-In')).toBeInTheDocument();
  expect(screen.getByText('NO ACCOUNT?')).toBeInTheDocument();
  
})

// test('check only Integers allowed in no of Card No',async()=>{
//   render(<Login />);
//   const input = screen.getByLabelText('Card Number');
//   expect(input.value).toBe('');
//   fireEvent.change(input, { target: { value: 'Good Day' } })
//   expect(input.value).toBe('');
// })


// test('Checks Empty Input', async () => {
//   render(<Login />)

//   fireEvent.click(screen.getByText('Login'))

//   await waitFor(() => screen.getByText("Password cannot be left blank"));
//   await waitFor(() => screen.getByText("cardNo cannot be left blank"));

//   expect(screen.getByText('Password cannot be left blank')).toBeInTheDocument();
//   expect(screen.getByText('cardNo cannot be left blank')).toBeInTheDocument();
// })


// test('check dashboard render',async ()=>{
//   render(<UserDashboard />);
//   expect(screen.getByText('Credit Card Recommendations')).toBeInTheDocument();
//   expect(screen.getByText('Credit Card Frauds')).toBeInTheDocument();
//   expect(screen.getByText('Transaction History')).toBeInTheDocument();

// })

// test('check Card Recommendation render',async ()=>{
//   render(<CardRecommendations />);
//   expect(screen.getByText("Here's a card you may like!")).toBeInTheDocument();
//   expect(screen.getByText('See what others are using')).toBeInTheDocument();
//   expect(screen.getByText('Browse Other Cards')).toBeInTheDocument();

// })

// test('check Fraud List render',async ()=>{
//   render(<FraudList />);
//   expect(screen.getByText("Possible Fraudulent transactions")).toBeInTheDocument();
//   expect(screen.getByText('No of transactions')).toBeInTheDocument();
//   expect(screen.getByText('Start Date')).toBeInTheDocument();
//   expect(screen.getByText('End Date')).toBeInTheDocument();
//   expect(screen.getByText('Search')).toBeInTheDocument();

// })

// test('check only Integers allowed in no of transaction Fraud List',async()=>{
//   render(<TransactionHistory />);
//   const input = screen.getByLabelText('Number of transactions');
//   expect(input.value).toBe('');
//   fireEvent.change(input, { target: { value: 'Good Day' } })
//   expect(input.value).toBe('');
// })
// test('check transaction history render',async ()=>{
//   render(<TransactionHistory />);
//   expect(screen.getByText("Your Transactions")).toBeInTheDocument();
//   expect(screen.getByText('No of transactions')).toBeInTheDocument();
//   expect(screen.getByText('Start Date')).toBeInTheDocument();
//   expect(screen.getByText('End Date')).toBeInTheDocument();
//   expect(screen.getByText('Search')).toBeInTheDocument();

// })

// test('check only Integers allowed in no of transaction Transaction history',async()=>{
//   render(<TransactionHistory />);
//   const input = screen.getByLabelText('Number of transactions');
//   expect(input.value).toBe('');
//   fireEvent.change(input, { target: { value: 'Good Day' } })
//   expect(input.value).toBe('');
// })

