import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const AddMarketForm = ({ onAddMarket }) => {
  const [marketName, setMarketName] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const [lat, lng] = coordinates.split(',').map(Number);
    const newMarket = {
      id: Date.now(), // Simple unique ID
      name: marketName,
      country,
      city,
      position: [lat, lng],
      description,
      image: 'https://via.placeholder.com/150',
    };
    onAddMarket(newMarket);
    // Reset form
    setMarketName('');
    setCountry('');
    setCity('');
    setCoordinates('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-white shadow-md">
      <h3 className="text-lg font-bold mb-4">Add a New Market</h3>
      <div className="space-y-3">
        <Input placeholder="Market Name" value={marketName} onChange={(e) => setMarketName(e.target.value)} required />
        <Input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} required />
        <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
        <Input placeholder="Latitude, Longitude" value={coordinates} onChange={(e) => setCoordinates(e.target.value)} required />
        <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <Button type="submit" className="w-full bg-maroon-800 hover:bg-maroon-900 text-white">
          Add Market
        </Button>
      </div>
    </form>
  );
};

export default AddMarketForm;
