# Chat Feature Testing Guide

## Overview
This guide will help you test the chat functionality between two test accounts:
- **Investor Account**: babblu2505@gmail.com
- **Startup Account**: greencharge@example.com

## Setup & Seeding

### Step 1: Seed Test Data
Run the seeding script to create test users and chat data:
```bash
cd Backend
node seeds/seedTestUsers.js
```

**Expected Output:**
```
Connected to MongoDB
✅ Seeding complete!
User 1 (Investor): babblu2505@gmail.com [user_id_1]
User 2 (Startup): greencharge@example.com [user_id_2]
Chat ID: [chat_id]
Messages count: 5
```

### Step 2: Verify Seeded Data
Verify that all data was correctly seeded:
```bash
node seeds/verifyData.js
```

**Expected Output:**
```
✅ Users found:
User 1: babblu2505@gmail.com - [user_id_1]
User 2: greencharge@example.com - [user_id_2]

✅ Chat found:
Chat ID: [chat_id]
Participants: babblu2505@gmail.com, greencharge@example.com
Last Message: Perfect! Looking forward to it. Send me the meeting link.

✅ Messages found: 5
1. [babblu2505@gmail.com]: Hi there! I am interested in your green energy project.
2. [greencharge@example.com]: Hello! Thanks for reaching out. We are working on sustainable energy solutions.
3. [babblu2505@gmail.com]: That sounds promising! Can we schedule a call to discuss the details?
4. [greencharge@example.com]: Absolutely! How about tomorrow at 2 PM?
5. [babblu2505@gmail.com]: Perfect! Looking forward to it. Send me the meeting link.
```

## Backend API Endpoints

### Get All Chats
**Endpoint:** `GET /api/chats`
**Headers:** `Authorization: Bearer {token}`
**Response:**
```json
{
  "chats": [
    {
      "_id": "chat_id",
      "participants": [
        {
          "_id": "user_id_1",
          "email": "babblu2505@gmail.com",
          "displayName": "Bablu Kumar",
          "avatarUrl": "https://via.placeholder.com/100?text=BK"
        },
        {
          "_id": "user_id_2",
          "email": "greencharge@example.com",
          "displayName": "Green Charge",
          "avatarUrl": "https://via.placeholder.com/100?text=GC"
        }
      ],
      "lastMessage": {
        "_id": "msg_id",
        "content": "Perfect! Looking forward to it. Send me the meeting link.",
        "sender": "user_id_1"
      },
      "updatedAt": "2025-12-07T12:00:00Z"
    }
  ]
}
```

### Get Messages in a Chat
**Endpoint:** `GET /api/messages/{chatId}`
**Headers:** `Authorization: Bearer {token}`
**Response:**
```json
{
  "messages": [
    {
      "_id": "msg_id_1",
      "content": "Hi there! I am interested in your green energy project.",
      "sender": {
        "_id": "user_id_1",
        "email": "babblu2505@gmail.com",
        "displayName": "Bablu Kumar"
      },
      "createdAt": "2025-12-07T10:55:00Z"
    },
    ...more messages
  ]
}
```

### Send a Message
**Endpoint:** `POST /api/messages/{chatId}`
**Headers:** 
```
Authorization: Bearer {token}
Content-Type: application/json
```
**Body:**
```json
{
  "content": "Your message here"
}
```
**Response:**
```json
{
  "message": {
    "_id": "new_msg_id",
    "chat": "chat_id",
    "sender": "user_id",
    "content": "Your message here",
    "createdAt": "2025-12-07T12:05:00Z"
  }
}
```

## Frontend Testing Flow

### Step 1: Start Backend Server
```bash
cd Backend
npm run dev
```

### Step 2: Start React Native App
```bash
cd Atmosphere
npm run android
# or for iOS:
npm run ios
```

### Step 3: Sign In with First Account
1. Open the app
2. Sign in with: **babblu2505@gmail.com**
3. Navigate to **Chats** section
4. You should see a chat with "Green Charge" showing the last message

### Step 4: Test Chat List
- **Chats Screen** should display:
  - Green Charge's avatar
  - Green Charge's name
  - Last message: "Perfect! Looking forward to it. Send me the meeting link."

### Step 5: Open Chat Detail
- Tap on the Green Charge chat
- **ChatDetail Screen** should display:
  - All 5 seeded messages in chronological order
  - Message indicators (who sent what)
  - Message input field

### Step 6: Send a New Message
1. Type a test message in the input field
2. Tap "Send"
3. Expected behavior:
   - Message appears in the chat immediately
   - Message is saved to database
   - Backend responds with the saved message object

### Step 7: Sign Out and Switch Accounts
1. Sign out from the first account
2. Sign in with: **greencharge@example.com**
3. Navigate to **Chats**
4. You should see a chat with "Bablu Kumar"
5. Open the chat and verify:
   - All messages are visible (including the new one you sent)
   - You can send a reply message

## Expected Data Flow

```
Frontend (Chats.tsx)
    ↓
fetch GET /api/chats with Bearer token
    ↓
Backend (chatService.listChats)
    ↓
Find all chats where user is participant
Populate participant details and lastMessage
    ↓
Return chats array
    ↓
Frontend displays chat list

---

Frontend (ChatDetail.tsx)
    ↓
fetch GET /api/messages/{chatId} with Bearer token
    ↓
Backend (messageService.getMessages)
    ↓
Find all messages for the chat
Populate sender details
Sort by creation time
    ↓
Return messages array
    ↓
Frontend displays messages

---

Frontend (ChatDetail.tsx - Send)
    ↓
fetch POST /api/messages/{chatId} with Bearer token + content
    ↓
Backend (messageService.sendMessage)
    ↓
Create new Message document
Save to database
Update Chat.lastMessage
    ↓
Return saved message object
    ↓
Frontend adds message to list
```

## Troubleshooting

### Issue: Blank Chats Screen
**Check:**
1. Backend server is running (`npm run dev`)
2. Token is being sent in Authorization header
3. User is authenticated
4. Check browser console for errors

### Issue: Messages Not Loading
**Check:**
1. ChatId is being passed correctly to ChatDetail
2. Backend `/api/messages/{chatId}` endpoint is accessible
3. Authorization header includes valid token

### Issue: Message Not Sending
**Check:**
1. Message content is not empty
2. POST request body format is correct: `{ content: "message" }`
3. Network request is successful (check console)
4. Backend is processing the message

## Database Cleanup

If you need to reset and reseed:
```bash
# Clear existing data
node -e "const mongoose = require('mongoose'); const { Chat, Message } = require('./models'); mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/atmosphere_dev').then(() => Promise.all([Chat.deleteMany({}), Message.deleteMany({})]).then(() => mongoose.disconnect()))"

# Reseed
node seeds/seedTestUsers.js
```

## Notes

- Test accounts are created with verified status for testing purposes
- Messages are timestamped in the past to simulate a real conversation
- Both users can view and participate in the chat
- The chat feature uses Bearer token authentication
- All requests require valid authentication headers
