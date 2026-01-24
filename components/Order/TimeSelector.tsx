'use client';

import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface TimeSelectorProps {
  onSubmit: (time: string) => void;
  isLoading?: boolean;
}

export default function TimeSelector({ onSubmit, isLoading = false }: TimeSelectorProps) {
  const [selectedTime, setSelectedTime] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  // Gerar horários de 30 em 30 minutos a partir de agora
  const generateTimeSlots = () => {
    const slots = [];
    const now = new Date();
    const startTime = new Date(now.getTime() + 30 * 60000); // Mínimo 30 minutos

    for (let i = 0; i < 12; i++) {
      const time = new Date(startTime.getTime() + i * 30 * 60000);
      const hours = String(time.getHours()).padStart(2, '0');
      const minutes = String(time.getMinutes()).padStart(2, '0');
      slots.push(`${hours}:${minutes}`);
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) {
      setError('Selecione um horário de retirada');
      return;
    }
    onSubmit(selectedTime);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Horário de Retirada</span>
          </div>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {timeSlots.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => {
                setSelectedTime(time);
                setError('');
              }}
              className={`p-3 rounded-lg border-2 font-medium transition-all ${
                selectedTime === time
                  ? 'border-blue-600 bg-blue-50 text-blue-600'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {time}
            </button>
          ))}
        </div>

        {error && (
          <div className="flex items-center space-x-1 mt-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition-colors"
      >
        {isLoading ? 'Processando...' : 'Confirmar Retirada'}
      </button>
    </form>
  );
}
