"use client";

import * as Dialog from '@radix-ui/react-dialog';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { useState } from 'react';
import { X } from 'lucide-react';

const feedbackOptions = [
  { id: 1, label: 'Melding onderwaard aan uw vrienden' },
  { id: 2, label: 'Technische problemen ervaren' },
  { id: 3, label: 'Suggesties voor verbetering' },
];

export function FeedbackPopup() {
  const [rating, setRating] = useState<number>(0);
  const [textFeedback, setTextFeedback] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          textFeedback,
          selectedOptions,
        }),
      });
      if (response.ok) {
        // Handle success
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="text-white bg-black hover:bg-black/90 transition-colors px-6 py-3 rounded-full text-sm font-medium">
          Give Feedback
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl w-[90vw] max-w-md shadow-xl animate-slide-up">
          <Dialog.Title className="sr-only">Feedback Form</Dialog.Title>
          
          <div className="absolute top-4 right-4">
            <Dialog.Close asChild>
              <button className="text-black hover:text-black/70 rounded-full p-1">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                <img src="@/logo.png" alt="Company Logo" className="w-10 h-10" />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-black">
                Jouw mening is belangrijk voor ons
              </h2>
              <p className="text-black text-sm">
                Help ons onze service te verbeteren
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="font-medium text-sm text-black">
                  Hoe waarschijnlijk is het dat u Melding onderwerard aan uw vrienden of collegas?
                </h3>
                
                <div className="flex gap-1.5 justify-between">
                  {[...Array(10)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setRating(i + 1)}
                      className={`w-9 h-9 rounded-lg transition-all ${
                        rating === i + 1 
                          ? 'bg-black text-white ring-2 ring-black ring-offset-2' 
                          : 'bg-gray-100 hover:bg-gray-200 text-black'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-black">
                  Waarom voelt u dat zo? (Optioneel)
                </label>
                <textarea
                  className="w-full p-3 border rounded-xl text-sm text-black focus:ring-2 focus:ring-black focus:ring-offset-1 focus:outline-none placeholder:text-gray-400"
                  rows={4}
                  value={textFeedback}
                  onChange={(e) => setTextFeedback(e.target.value)}
                  placeholder="Deel uw gedachten hier..."
                />
              </div>

              <RadioGroup.Root
                className="space-y-3"
                onValueChange={(value) => setSelectedOptions([...selectedOptions, value])}
              >
                <div className="text-sm font-medium text-black mb-2">
                  Welke optie beschrijft uw ervaring het best?
                </div>
                {feedbackOptions.map((option) => (
                  <div key={option.id} className="flex items-center">
                    <RadioGroup.Item
                      id={String(option.id)}
                      value={String(option.id)}
                      className="w-5 h-5 rounded-full border border-gray-300 mr-3 flex items-center justify-center focus:ring-2 focus:ring-black focus:ring-offset-1"
                    >
                      <RadioGroup.Indicator className="w-2.5 h-2.5 rounded-full bg-black" />
                    </RadioGroup.Item>
                    <label 
                      htmlFor={String(option.id)}
                      className="text-sm text-black"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </RadioGroup.Root>
            </div>

            <div className="flex gap-3 pt-4">
              <Dialog.Close asChild>
                <button className="flex-1 px-4 py-2.5 border rounded-xl text-sm font-medium text-black hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-black/90 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}