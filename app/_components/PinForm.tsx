//What I Learn ?
//spred Operator , Synthesis Form Event type like React.FormEvent
//used OR operator in setFormData

import { useEffect, useState } from "react";
import { PinFormProps, pin } from "../types";

export default function PinForm({
  pin,
  categories,
  onSave,
  onClose,
}: PinFormProps) {
  const [formData, setFormData] = useState<pin>(pin);

  useEffect(() => {
    if (categories.length === 0) return;

    setFormData(prev => ({
      ...prev,
      category: prev.category || categories[0].name, // ✅ force valid category
    }));
  }, [categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="form-overlay">
      <div className="form-popup">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            required
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />

          <textarea
            style={{ height: "200px" }}
            placeholder="Description"
            value={formData.description}
            required
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <select
            value={formData.category}
            required
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            {categories.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <div className="form-buttons">
            <button type="submit" className="btn save">
              Save
            </button>
            <button type="button" className="btn cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
