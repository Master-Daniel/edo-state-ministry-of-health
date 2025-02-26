import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import add from "../../public/assets/icons/add.svg";
import FormSection from "./FormSection";

const FormCard: React.FC = () => {
  const dispatch = useDispatch();
  const [sections, setSections] = useState([{ id: "section-0" }]); // Track sections with unique IDs

  const addSection = () => {
    setSections([...sections, { id: `section-${sections.length}` }]); // Add a new section with a unique ID
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return; // If dropped outside, do nothing

    const updatedSections = [...sections];
    const [movedSection] = updatedSections.splice(result.source.index, 1);
    updatedSections.splice(result.destination.index, 0, movedSection);

    setSections(updatedSections);
  };

  return (
    <div className="row justify-center relative mb-5">
      <div className="col-md-10 relative">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="form-sections">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {sections.map((section, index) => (
                  <Draggable
                    key={section.id}
                    draggableId={section.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="mb-2 cursor-grab"
                      >
                        <FormSection />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="flex justify-end my-5">
          <button className="btn px-5 py-3 btn-success">Save</button>
        </div>
      </div>

      <div
        className="add-component bg-white p-2 shadow-md rounded-lg cursor-pointer absolute bottom-4 right-4"
        onClick={addSection}
      >
        <img src={add} alt="add component" className="add-component-image" />
      </div>
    </div>
  );
};

export default FormCard;
