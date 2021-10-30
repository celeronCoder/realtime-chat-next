import Head from "next/head";

import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import React, { useState } from "react";
import { io } from "socket.io-client";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Timeline } from "primereact/timeline";

const socket = io("http://localhost:3001");

socket.on("connect", () => {
	console.log(socket.id);
});

export default function Home() {
	const [author, setAuthor] = useState("");
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([
		{ author: "Bot", message: "Welcome, chat with your friends." },
	]);

	socket.on("chat", arg => setMessages([...messages, arg]));

	const addMessage = () => {
		const send = { author, message };
		setMessages(...messages, send);
		socket.emit("chat", send);
		setMessage("");
	};

	return (
		<div className="container">
			<Head>
				<title>Chatty-Met</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				<div className="p-col-12 p-md-4">
					<div className="p-inputgroup">
						<span className="p-inputgroup-addon">
							<i className="pi pi-user"></i>
						</span>
						<InputText
							placeholder="Name"
							value={author}
							onChange={e => setAuthor(e.target.value)}
						/>
						<InputText
							placeholder="Chat"
							value={message}
							onChange={e => setMessage(e.target.value)}
						/>
						<Button label="Send" onClick={() => addMessage()} />
					</div>
				</div>
				<div className="card">
					<h4 align="center">Conversation</h4>
					<Timeline
						value={messages}
						opposite={item => item.author}
						content={item => (
							<small className="p-text-secondary">
								{item.message}
							</small>
						)}
					/>
				</div>
			</main>

			<style jsx global>{`
				html,
				body {
					padding: 0;
					margin: 0;
					font-family: -apple-system, BlinkMacSystemFont, Segoe UI,
						Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,
						Helvetica Neue, sans-serif;
				}

				* {
					box-sizing: border-box;
				}
			`}</style>
		</div>
	);
}
