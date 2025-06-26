"use client"

import type React from "react"
import { useState } from "react"

const HelpPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [ticketDetails, setTicketDetails] = useState({
    subject: "",
    description: "",
  })
  const [chatMessages, setChatMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTicketDetails({ ...ticketDetails, [e.target.name]: e.target.value })
  }

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, you would submit the ticket details to a backend service.
    console.log("Ticket submitted:", ticketDetails)
    alert("Ticket submitted! (This is a simulation)")
    setTicketDetails({ subject: "", description: "" }) // Reset form
  }

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setChatMessages([...chatMessages, { text: newMessage, sender: "user" }])
      // Simulate a response from the "agent" after a short delay
      setTimeout(() => {
        setChatMessages([
          ...chatMessages,
          { text: `Thanks for your message! We'll get back to you soon. (Simulated)`, sender: "agent" },
        ])
      }, 1000)
      setNewMessage("")
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Help Center</h1>

      {/* Search Functionality */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for help..."
          className="w-full p-2 border rounded"
          value={searchTerm}
          onChange={handleSearch}
        />
        {searchTerm && (
          <div className="mt-2">
            {/* Simulate search results */}
            <p>Search results for: {searchTerm}</p>
            <ul>
              <li>
                <a href="#">Article 1 related to "{searchTerm}"</a>
              </li>
              <li>
                <a href="#">Article 2 related to "{searchTerm}"</a>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Category Navigation */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Categories</h2>
        <ul className="flex space-x-4">
          <li>
            <button
              className={`px-4 py-2 rounded ${selectedCategory === "account" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => handleCategoryChange("account")}
            >
              Account
            </button>
          </li>
          <li>
            <button
              className={`px-4 py-2 rounded ${selectedCategory === "billing" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => handleCategoryChange("billing")}
            >
              Billing
            </button>
          </li>
          <li>
            <button
              className={`px-4 py-2 rounded ${selectedCategory === "technical" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => handleCategoryChange("technical")}
            >
              Technical
            </button>
          </li>
        </ul>
        {selectedCategory && (
          <div className="mt-2">
            {/* Simulate category content */}
            <p>Content for category: {selectedCategory}</p>
            <ul>
              <li>Article 1 in {selectedCategory}</li>
              <li>Article 2 in {selectedCategory}</li>
            </ul>
          </div>
        )}
      </div>

      {/* Ticket System Form */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Submit a Ticket</h2>
        <form onSubmit={handleSubmitTicket} className="space-y-2">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Subject:
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              className="w-full p-2 border rounded"
              value={ticketDetails.subject}
              onChange={handleTicketChange}
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full p-2 border rounded"
              value={ticketDetails.description}
              onChange={handleTicketChange}
              required
            />
          </div>
          <div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Submit Ticket
            </button>
          </div>
        </form>
      </div>

      {/* Live Chat Simulation */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Live Chat</h2>
        <div className="border rounded p-2 h-64 overflow-y-auto mb-2">
          {chatMessages.map((message, index) => (
            <div key={index} className={`mb-2 ${message.sender === "user" ? "text-right" : "text-left"}`}>
              <span className={`inline-block p-2 rounded ${message.sender === "user" ? "bg-blue-200" : "bg-gray-200"}`}>
                {message.text}
              </span>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            className="w-full p-2 border rounded mr-2"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default HelpPage
