import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditAccomplishment = ({ accomplishment, onUpdate, onCancel }) => {
  const [text, setText] = useState(accomplishment.text);
  const [category, setCategory] = useState(accomplishment.category);
  const [isLoading, setIsLoading] = useState(false);
  const categories = ["Academic", "Mental", "Physical"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/accomplishments/${accomplishment._id}`,
        { text, category }
      );
      
      toast.success("Accomplishment updated!");
      onUpdate(response.data);
    } catch (error) {
      toast.error("Failed to update accomplishment");
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="edit-form">
      <form onSubmit={handleSubmit}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-select"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="form-input"
          required
        />
        
        <div className="form-actions">
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAccomplishment;