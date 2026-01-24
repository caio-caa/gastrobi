'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Bike, Clock, Star } from 'lucide-react';

interface WelcomeScreenProps {
  restaurantName: string;
  restaurantLocation: string;
  isOpen: boolean;
  rating: number;
  reviews: number;
  deliveryTime: string;
  deliveryFee: number;
  onDineIn: () => void;
  onDelivery: () => void;
}

export default function WelcomeScreen({ 
  restaurantName,
  restaurantLocation,
  isOpen,
  rating,
  reviews,
  deliveryTime,
  deliveryFee,
  onDineIn, 
  onDelivery 
}: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-green-600 to-green-700 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <div className="flex items-center space-x-3">
          <Link 
            href="/"
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-lg font-bold">{restaurantName}</h1>
            <p className="text-sm opacity-90">{restaurantLocation}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <div className={`w-2 h-2 rounded-full animate-pulse ${isOpen ? 'bg-green-300' : 'bg-red-300'}`}></div>
          <span>{isOpen ? 'Aberto' : 'Fechado'}</span>
        </div>
      </div>

      {/* Hero Image */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-64 h-64 rounded-3xl overflow-hidden mb-8 shadow-2xl">
          <img 
            src="https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400"
            alt="Hambúrguer especial"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-white mb-8">
          <h2 className="text-3xl font-bold mb-4">
            Olá! Que bom ver você aqui! 😃
          </h2>
          <p className="text-lg opacity-90 mb-2">
            Como você gostaria de fazer seu pedido?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={onDineIn}
            className="w-full bg-white text-green-600 py-4 px-6 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <Home className="w-6 h-6" />
            <span>Estou no restaurante</span>
          </button>

          <button
            onClick={onDelivery}
            className="w-full bg-white/10 backdrop-blur-sm text-white py-4 px-6 rounded-2xl font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <Bike className="w-6 h-6" />
            <span>Quero delivery</span>
          </button>
        </div>

        {/* Info Cards */}
        <div className="flex items-center space-x-4 mt-8 text-white/80 text-sm">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{deliveryTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-current" />
            <span>{rating} ({reviews})</span>
          </div>
          <div className="flex items-center space-x-1">
            <Bike className="w-4 h-4" />
            <span>R$ {deliveryFee.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
