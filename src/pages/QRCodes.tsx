import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  Download,
  Plus,
  Edit,
  Trash2,
  Eye,
  Printer,
  Copy,
  Check,
  Users,
  Smartphone
} from 'lucide-react';
import { useMenu } from '../contexts/MenuContext';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

function QRCodes() {
  const { tables, generateTableQR } = useMenu();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTableNumber, setNewTableNumber] = useState('');
  const [copiedUrl, setCopiedUrl] = useState('');

  const getSlug = () =>
    user?.currentRestaurant.name.toLowerCase().replace(/\s+/g, '-');

  const getPublicMenuUrl = () =>
    `${window.location.origin}/menu/${getSlug()}`;

  const getTableUrl = (tableNumber: string) =>
    `${getPublicMenuUrl()}?table=${tableNumber}`;

  const handleAddTable = () => {
    console.log('Nova mesa:', newTableNumber);
    setNewTableNumber('');
    setShowAddModal(false);
  };

  const downloadQR = (tableNumber: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svg = document.querySelector(`#qr-${tableNumber}`) as any;

    if (svg && ctx) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();

      img.onload = () => {
        canvas.width = 300;
        canvas.height = 400;

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 25, 50, 250, 250);

        ctx.fillStyle = 'black';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Mesa ${tableNumber}`, canvas.width / 2, 30);
        ctx.font = '16px Arial';
        ctx.fillText('Escaneie para acessar o cardápio', canvas.width / 2, 330);
        ctx.font = '14px Arial';
        ctx.fillText('e fazer seu pedido com o garçom', canvas.width / 2, 350);
        ctx.font = 'bold 14px Arial';
        ctx.fillText(user?.currentRestaurant.name || '', canvas.width / 2, 380);

        const link = document.createElement('a');
        link.download = `mesa-${tableNumber}-qr.png`;
        link.href = canvas.toDataURL();
        link.click();
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(''), 2000);
  };

  const printQR = (tableNumber: string) => {
    const printWindow = window.open('', '_blank');
    const qrElement = document.querySelector(`#qr-${tableNumber}`)?.outerHTML;

    if (printWindow && qrElement) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - Mesa ${tableNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 20px; margin: 0; }
              .qr-container {
                display: inline-block;
                padding: 30px;
                border: 3px solid #000;
                margin: 20px;
                border-radius: 10px;
              }
              h1 { margin-bottom: 20px; font-size: 24px; color: #333; }
              .instructions {
                margin-top: 20px; font-size: 16px; line-height: 1.5;
              }
              .restaurant-name {
                margin-top: 15px; font-weight: bold; font-size: 18px; color: #2563eb;
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <h1>Mesa ${tableNumber}</h1>
              ${qrElement}
              <div class="instructions">
                <p>1. Escaneie o QR Code com seu celular</p>
                <p>2. Navegue pelo cardápio digital</p>
                <p>3. Chame o garçom para fazer seu pedido</p>
              </div>
              <div class="restaurant-name">${user?.currentRestaurant.name}</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">QR Codes das Mesas</h1>
          <p className="text-gray-600">Gere QR codes para que clientes acessem o cardápio e façam pedidos com garçons</p>
        </div>
        <div className="flex space-x-3">
          <Button
            icon={Eye}
            variant="outline"
            onClick={() => navigate(`/menu/${getSlug()}`)}
          >
            Ver Cardápio
          </Button>
          <Button icon={Plus} onClick={() => setShowAddModal(true)}>
            Nova Mesa
          </Button>
        </div>
      </div>

      {/* Informações do Sistema */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Smartphone className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Como Funciona o Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
              {/* Etapas do funcionamento */}
              {[1, 2, 3].map((step, i) => (
                <div className="flex items-start space-x-2" key={i}>
                  <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-900 font-bold text-xs">
                    {step}
                  </div>
                  <div>
                    <p className="font-medium">
                      {step === 1 ? 'Cliente escaneia QR' : step === 2 ? 'Navega pelo cardápio' : 'Chama o garçom'}
                    </p>
                    <p>
                      {step === 1 ? 'Acessa o cardápio digital no celular' :
                        step === 2 ? 'Vê preços, descrições e fotos' :
                          'Faz o pedido pessoalmente'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-blue-900 font-medium">URL do Cardápio:</p>
              <div className="flex items-center space-x-2 mt-1">
                <code className="bg-white px-2 py-1 rounded text-sm text-gray-700 flex-1">
                  {getPublicMenuUrl()}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  icon={copiedUrl === getPublicMenuUrl() ? Check : Copy}
                  onClick={() => copyUrl(getPublicMenuUrl())}
                >
                  {copiedUrl === getPublicMenuUrl() ? 'Copiado!' : 'Copiar'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total de Mesas', value: tables.length, icon: QrCode, bg: 'bg-blue-50', color: 'text-blue-600' },
          { label: 'Mesas Ativas', value: tables.filter(t => t.isActive).length, icon: Eye, bg: 'bg-green-50', color: 'text-green-600' },
          { label: 'QR Codes Gerados', value: tables.length, icon: Download, bg: 'bg-purple-50', color: 'text-purple-600' }
        ].map(({ label, value, icon: Icon, bg, color }, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
              </div>
              <div className={`p-3 rounded-lg ${bg}`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* QR Codes das Mesas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">QR Codes das Mesas</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables.map((table) => (
            <div key={table.id} className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Mesa {table.number}</h4>
                <div className="flex justify-center mb-4">
                  <QRCodeSVG
                    id={`qr-${table.number}`}
                    value={getTableUrl(table.number)}
                    size={150}
                    level="M"
                    includeMargin={true}
                  />
                </div>
                <div className="text-xs text-gray-500 mb-4 break-all">
                  <code className="bg-gray-100 px-2 py-1 rounded">Mesa {table.number}</code>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" icon={Download} onClick={() => downloadQR(table.number)} className="flex-1">Baixar</Button>
                  <Button size="sm" variant="outline" icon={Printer} onClick={() => printQR(table.number)} className="flex-1">Imprimir</Button>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  icon={copiedUrl === getTableUrl(table.number) ? Check : Copy}
                  onClick={() => copyUrl(getTableUrl(table.number))}
                  className="w-full"
                >
                  {copiedUrl === getTableUrl(table.number) ? 'URL Copiada!' : 'Copiar URL'}
                </Button>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${table.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {table.isActive ? 'Ativa' : 'Inativa'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Nova Mesa */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Nova Mesa"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número da mesa
            </label>
            <input
              type="text"
              value={newTableNumber}
              onChange={(e) => setNewTableNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: 01, 02, A1, B2"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="ghost" onClick={() => setShowAddModal(false)}>Cancelar</Button>
            <Button onClick={handleAddTable}>Criar Mesa</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default QRCodes;
