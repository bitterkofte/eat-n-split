// import React from 'react'
import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    imgURL: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    imgURL: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    imgURL: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null)

  const selectionHandler = (fr) => {
    setSelectedFriend(cur => cur?.id === fr.id ? null : fr);
    setIsFormVisible(false);
  }

  const updateAfterSubmit = (value) => {
    setFriends(friends => friends.map(f => f.id === selectedFriend.id
      ? {...f, balance: f.balance + value}
      : f
    ))
    setSelectedFriend(null)
  }

  return (
    <div className="app">
      <div className='sidebar'>
        <FriendsList friends={friends} selectedFriend={selectedFriend} onSelection={selectionHandler} />
        {isFormVisible && <FormAddFriend setFriends={setFriends} />}
        <MyButton onClick={() => setIsFormVisible((state) => !state)} >{isFormVisible ? 'Close' : 'Add New'}</MyButton>
      </div>

      {selectedFriend && <FormSplitBill selectedFriend={selectedFriend} onSplitBill={updateAfterSubmit} />}
    </div>
  )
}

function FriendsList ({friends, onSelection, selectedFriend}) {
  // const friends = initialFriends;
  return(
    <ul>
      {friends.map(fr => (
        <Friend fr={fr} key={fr.id} selectedFriend={selectedFriend} onSelection={onSelection} />
      ))}
    </ul>
  );
}

function Friend ({fr, onSelection, selectedFriend}) {
  const isSelected = selectedFriend?.id === fr.id;
  return(
    <li>
      <img className='' src={fr.imgURL} alt={fr.name} />
      <h3 className=''>{fr.name}</h3>
      {
        fr.balance < 0 ? <p className='red'>You owe {fr.name} {Math.abs(fr.balance)}€</p> :
        fr.balance > 0 ? <p className='green'>{fr.name} owes you {Math.abs(fr.balance)}€</p> :
        <p className=''>You and {fr.name} are even</p>
      }
      <MyButton onClick={() => onSelection(fr)}>
        {isSelected ? "Close" : "Select"}
      </MyButton>
    </li>
  )
}

function MyButton ({children, onClick}) {
  return <button className='button' onClick={onClick}>{children}</button>
}

function FormAddFriend ({setFriends}) {
  const [name, setName] = useState('')
  const [imgURL, setImgURL] = useState('https://i.pravatar.cc/48')

  const submitHandler = (e) => {
    e.preventDefault();
    if(!name || !imgURL) return;
    let id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      imgURL: `${imgURL}?=${id}`,
      balance: 0,
    };
    setFriends(prev => [...prev, newFriend]);
    setName('');
    setImgURL('https://i.pravatar.cc/48');
  }
  return (
    <form className="form-add-friend" onSubmit={submitHandler}>
      <label className=''>Friend Name</label>
      <input type='text' className='' value={name} onChange={(e) => setName(e.target.value)} placeholder='' ></input>
      <label className=''>Image URL</label>
      <input type='text' className='' value={imgURL} onChange={(e) => setImgURL(e.target.value)} placeholder='' ></input>
      <MyButton>Add</MyButton>
    </form>
  )
}

function FormSplitBill ({selectedFriend, onSplitBill}) {
  const [bill, setBill] = useState('');
  const [expense, setExpense] = useState('');
  const [whoIsPaying, setWhoIsPaying] = useState('user')
  const other = bill ? bill - expense : "";

  const submitHandler = (e) => {
    e.preventDefault();

    if(!bill || !expense) return;
    onSplitBill(whoIsPaying === "user" ? other : -expense);
  }

  return (
    <form className='form-split-bill' onSubmit={submitHandler}>
      <h2 className=''>Split a bill with {selectedFriend.name}</h2>
      <label className=''>Bill Value</label>
      <input type='text' className='' value={bill} onChange={(e) => setBill(Number(e.target.value))} placeholder='' ></input>
      <label className=''>Your Expense</label>
      <input type='text' className='' value={expense} onChange={(e) => setExpense(Number(e.target.value) > bill ? expense : Number(e.target.value))} placeholder='' ></input>
      <label className=''>{selectedFriend.name}'s Expense</label>
      <input type='text' className='' value={other} placeholder='' disabled></input>
      <label className=''>Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value={'user'}>You</option>
        <option value={'friend'}>{selectedFriend.name}</option>
      </select>
      <MyButton>Split Bill</MyButton>
    </form>
  )
}