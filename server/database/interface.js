// This file handles connecting to the remote mongoDB server.

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Note = require('../models/Note');

// CONNECTION

/**
 * Connects to the MongoDB database using the connection string from the environment variables.
 * Logs a message on success, or logs an error and exits the process on failure.
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

/**
 * Disconnects from the MongoDB database.
 * Logs a message once the connection is closed.
 * @returns {Promise<void>}
 */
async function disconnectDB() {
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
}

// USER

/**
 * Creates a new user.
 * @param {String} email - The user's email.
 * @param {String} password - The user's password.
 * @returns {Promise<Object>} - The created user document.
 */
async function createUser(email, password) {
  const user = new User({
    email,
    password,
  });
  return await user.save();
}

/**
 * Gets a user by email.
 * @param {String} email - The email to search.
 * @returns {Promise<Object>} - The user document, or null if not found.
 */
async function getUserByEmail(email) {
  return await User.findOne({ email });
}

/**
 * Gets a user by ID.
 * @param {String} id - The user ID.
 * @returns {Promise<Object>} - The user document, or null if not found.
 */
async function getUserById(id) {
  return await User.findById(id);
}

/**
 * Gets a user's email by user ID.
 * @param {String} id - The user ID.
 * @returns {Promise<String|null>} - The email, or null if not found.
 */
async function getUserEmail(id) {
  const user = await User.findById(id, 'email');
  return user ? user.email : null;
}

/**
 * Sets a new email for a user.
 * @param {String} id - The user ID.
 * @param {String} newEmail - The new email.
 * @returns {Promise<Object|null>} - The updated user document, or null if not found.
 */
async function setUserEmail(id, newEmail) {
  const user = await User.findById(id);
  if (!user) return null;
  user.email = newEmail;
  return await user.save();
}

/**
 * Sets a new password for a user.
 * @param {String} id - The user ID.
 * @param {String} newPassword - The new password.
 * @returns {Promise<Object|null>} - The updated user document, or null if not found.
 */
async function setUserPassword(id, newPassword) {
  const user = await User.findById(id);
  if (!user) return null;
  user.password = newPassword;
  return await user.save();
}

// NOTE

/**
 * Creates a new note for a given user.
 * @param {Object} user - The user object (must include _id).
 * @param {String} title - The title of the note.
 * @param {String} [content=""] - The content of the note; defaults to an empty string.
 * @returns {Promise<Object>} - The newly created note document.
 */
async function createNote(user, title, content = "") {
  const note = new Note({
    ownerID: user._id,
    title,
    content,
  });
  return await note.save();
}

/**
 * Checks whether a note belongs to a specific user.
 * @param {String} noteId - The ID of the note.
 * @param {String} ownerID - The ID of the user.
 * @returns {Promise<Boolean>} - True if the note belongs to the user, false otherwise.
 */
async function noteBelongsToUser(noteId, ownerID) {
  const note = await Note.findById(noteId, 'ownerID');
  if (!note) return false;
  return note.ownerID.toString() === ownerID.toString();
}

/**
 * Updates the content of an existing note by its ID.
 * Also updates the "updatedAt" field to the current time.
 * @param {String} noteId - The note's ID.
 * @param {String} newContent - The new content for the note.
 * @returns {Promise<Object|null>} - The updated note document, or null if not found.
 */
async function updateNoteContent(noteId, newContent) {
  return await Note.findByIdAndUpdate(
    noteId,
    { content: newContent, updatedAt: new Date() },
    { new: true }
  );
}

/**
 * Retrieves all notes that belong to a specific user.
 * @param {String} userId - The ID of the user.
 * @returns {Promise<Array>} - An array of note documents belonging to the user.
 */
async function getNotesByUserId(ownerID) {
  return await Note.find({ ownerID });
}

/**
 * Deletes a note by its ID.
 * @param {String} noteId - The ID of the note to remove.
 * @returns {Promise<Object|null>} - The deleted note document, or null if no note was found.
 */
async function removeNote(noteId) {
  return await Note.findByIdAndDelete(noteId);
}

// LISTS

/**
 * Adds a new list entry to a note's "lists" array.
 * The new entry is created with the provided text and completed set to false.
 * @param {String} noteId - The ID of the note.
 * @param {String} text - The text for the new list entry.
 * @returns {Promise<Object|null>} - The updated note document, or null if not found.
 */
async function addToList(noteId, text) {
  const listEntry = {
    text,
    completed: false,
    createdAt: new Date()
  };

  return await Note.findByIdAndUpdate(
    noteId,
    { 
      $push: { lists: listEntry },
      $set: { updatedAt: new Date() }
    },
    { new: true }
  );
}

/**
 * Sets the completed status for a specific list entry within a note.
 * @param {String} noteId - The ID of the note.
 * @param {String} listEntryId - The ID of the list entry to update.
 * @param {Boolean} completed - The completion status to set.
 * @returns {Promise<Object|null>} - The updated note document, or null if not found.
 */
async function setListItemCompletion(noteId, listEntryId, completed) {
  return await Note.findOneAndUpdate(
    { _id: noteId, "lists._id": listEntryId },
    { $set: { "lists.$.completed": completed, updatedAt: new Date() } },
    { new: true }
  );
}

/**
 * Removes a list entry from a note's "lists" array by its ID.
 * Also updates the "updatedAt" field to the current time.
 * @param {String} noteId - The ID of the note.
 * @param {String} listEntryId - The ID of the list entry to remove.
 * @returns {Promise<Object|null>} - The updated note document, or null if not found.
 */
async function removeListItem(noteId, listEntryId) {
  return await Note.findByIdAndUpdate(
    noteId,
    {
      $pull: { lists: { _id: listEntryId } },
      $set: { updatedAt: new Date() }
    },
    { new: true }
  );
}

module.exports = {
  connectDB,
  disconnectDB,
  createUser,
  getUserByEmail,
  getUserById,
  getUserEmail,
  setUserEmail,
  setUserPassword,
  createNote,
  noteBelongsToUser,
  updateNoteContent,
  getNotesByUserId,
  removeNote,
  addToList,
  setListItemCompletion,
  removeListItem
};