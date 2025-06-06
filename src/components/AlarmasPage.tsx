import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import SidebarOperator from "./SidebarOperator";
import HeaderOperator from "./HeaderOperator";
import { Home, Eye, AlertTriangle, Clock, Settings, Filter, Search, Bell, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";

// Tipo para las alarmas
interface Alarma {
  id: string;
  componente: string;
  titulo: string;
  descripcion: string;
  timestamp: string;
  tipo: 'error' | 'warning' | 'info' | 'success';
  estado: 'activa' | 'reconocida' | 'resuelta';
}

// Datos de ejemplo para las alarmas
const alarmasEjemplo: Alarma[] = [
  {
    id: 'alm-001',
    componente: 'Transelevador T1',
    titulo: 'Error de posicionamiento',
    descripcion: 'El transelevador T1 ha reportado un error en el posicionamiento vertical.',
    timestamp: '2025-05-03T14:35:23',
    tipo: 'error',
    estado: 'activa'
  },
  {
    id: 'alm-002',
    componente: 'Transelevador T2',
    titulo: 'Mantenimiento preventivo',
    descripcion: 'Se requiere mantenimiento programado del sistema de posicionamiento.',
    timestamp: '2025-05-03T13:50:10',
    tipo: 'warning',
    estado: 'reconocida'
  },
  {
    id: 'alm-003',
    componente: 'Puente',
    titulo: 'Error de comunicación',
    descripcion: 'El puente ha reportado un error en la comunicación con el PLC.',
    timestamp: '2025-05-03T13:30:45',
    tipo: 'error',
    estado: 'activa'
  },
  {
    id: 'alm-004',
    componente: 'Carro de Transferencia',
    titulo: 'Batería baja',
    descripcion: 'El carro de transferencia ha reportado un nivel bajo de batería.',
    timestamp: '2025-05-03T12:45:32',
    tipo: 'warning',
    estado: 'activa'
  },
  {
    id: 'alm-005',
    componente: 'Elevador',
    titulo: 'Sobrecarga detectada',
    descripcion: 'El elevador ha detectado una sobrecarga en la plataforma.',
    timestamp: '2025-05-03T12:15:18',
    tipo: 'error',
    estado: 'reconocida'
  },
  {
    id: 'alm-006',
    componente: 'Transelevador T1',
    titulo: 'Ciclo completado',
    descripcion: 'El transelevador T1 ha completado el ciclo de transporte #2145.',
    timestamp: '2025-05-03T11:45:45',
    tipo: 'success',
    estado: 'resuelta'
  },
  {
    id: 'alm-007',
    componente: 'Sistema',
    titulo: 'Actualización de firmware',
    descripcion: 'Nueva actualización de firmware disponible para el sistema de control.',
    timestamp: '2025-05-03T11:20:32',
    tipo: 'info',
    estado: 'reconocida'
  },
  {
    id: 'alm-008',
    componente: 'Puente',
    titulo: 'Ciclo completado',
    descripcion: 'El puente ha completado el ciclo de transporte #1876.',
    timestamp: '2025-05-03T10:55:45',
    tipo: 'success',
    estado: 'resuelta'
  },
  {
    id: 'alm-009',
    componente: 'Carro de Transferencia',
    titulo: 'Mantenimiento completado',
    descripcion: 'Se ha completado el mantenimiento preventivo del carro de transferencia.',
    timestamp: '2025-05-03T10:30:22',
    tipo: 'info',
    estado: 'resuelta'
  },
  {
    id: 'alm-010',
    componente: 'Elevador',
    titulo: 'Ciclo completado',
    descripcion: 'El elevador ha completado el ciclo de elevación #1245.',
    timestamp: '2025-05-03T10:05:45',
    tipo: 'success',
    estado: 'resuelta'
  }
];

const AlarmasPage = () => {
  const [activeTab, setActiveTab] = useState('todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroComponente, setFiltroComponente] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const navigate = useNavigate();

  // Filtrar alarmas según los criterios seleccionados
  const alarmasFiltradas = alarmasEjemplo.filter(alarma => {
    // Filtro por pestaña (estado)
    if (activeTab !== 'todas' && alarma.estado !== activeTab) {
      return false;
    }
    
    // Filtro por término de búsqueda
    if (searchTerm && !alarma.titulo.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !alarma.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filtro por componente
    if (filtroComponente !== 'todos' && alarma.componente !== filtroComponente) {
      return false;
    }
    
    // Filtro por tipo
    if (filtroTipo !== 'todos' && alarma.tipo !== filtroTipo) {
      return false;
    }
    
    return true;
  });

  // Función para obtener el color de fondo según el tipo de alarma
  const getBgColor = (tipo: string) => {
    switch (tipo) {
      case 'error': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      case 'success': return 'bg-green-50 border-green-200';
      default: return 'bg-white border-gray-200';
    }
  };

  // Función para obtener el color del badge según el estado de la alarma
  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case 'activa': return 'bg-red-500 hover:bg-red-600';
      case 'reconocida': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'resuelta': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="flex bg-operator-gray-bg min-h-screen font-sans">
      <SidebarOperator />
      <div className="flex-1 flex flex-col">
        <HeaderOperator />
        
        {/* Navegación superior con botones grises y letras blancas */}
        <div className="bg-gray-700 px-6 py-3 flex space-x-4">
          <button 
            className="flex items-center space-x-2 px-4 py-2 rounded-md text-white hover:bg-gray-600 transition-colors"
            onClick={() => navigate('/')}
          >
            <Home size={18} />
            <span>Inicio</span>
          </button>
          <button 
            className="flex items-center space-x-2 px-4 py-2 rounded-md text-white hover:bg-gray-600 transition-colors"
            onClick={() => navigate('/transelevador/t1')}
          >
            <Eye size={18} />
            <span>Visualización</span>
          </button>
          <button 
            className="flex items-center space-x-2 px-4 py-2 rounded-md bg-gray-600 text-white hover:bg-gray-500 transition-colors"
          >
            <AlertTriangle size={18} />
            <span>Alarmas</span>
          </button>
          <button 
            className="flex items-center space-x-2 px-4 py-2 rounded-md text-white hover:bg-gray-600 transition-colors"
          >
            <Clock size={18} />
            <span>Históricos</span>
          </button>
          <button 
            className="flex items-center space-x-2 px-4 py-2 rounded-md text-white hover:bg-gray-600 transition-colors"
          >
            <Settings size={18} />
            <span>Control</span>
          </button>
        </div>
        
        <main className="flex-1 p-10">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800 flex items-center">
              <AlertTriangle className="mr-2" size={24} />
              Alarmas
            </h1>
            <p className="text-gray-600 mt-1">Gestión centralizada de alarmas del sistema</p>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Panel de Alarmas</CardTitle>
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Buscar alarmas..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="w-48">
                    <Select value={filtroComponente} onValueChange={setFiltroComponente}>
                      <SelectTrigger>
                        <SelectValue placeholder="Componente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos los componentes</SelectItem>
                        <SelectItem value="Transelevador T1">Transelevador T1</SelectItem>
                        <SelectItem value="Transelevador T2">Transelevador T2</SelectItem>
                        <SelectItem value="Puente">Puente</SelectItem>
                        <SelectItem value="Carro de Transferencia">Carro de Transferencia</SelectItem>
                        <SelectItem value="Elevador">Elevador</SelectItem>
                        <SelectItem value="Sistema">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-40">
                    <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos los tipos</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="warning">Advertencia</SelectItem>
                        <SelectItem value="info">Información</SelectItem>
                        <SelectItem value="success">Éxito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => {
                    setSearchTerm('');
                    setFiltroComponente('todos');
                    setFiltroTipo('todos');
                  }}>
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="todas" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="todas" className="relative">
                    Todas
                    <Badge className="ml-2 bg-gray-500">{alarmasEjemplo.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="activa" className="relative">
                    Activas
                    <Badge className="ml-2 bg-red-500">{alarmasEjemplo.filter(a => a.estado === 'activa').length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="reconocida" className="relative">
                    Reconocidas
                    <Badge className="ml-2 bg-yellow-500">{alarmasEjemplo.filter(a => a.estado === 'reconocida').length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="resuelta" className="relative">
                    Resueltas
                    <Badge className="ml-2 bg-green-500">{alarmasEjemplo.filter(a => a.estado === 'resuelta').length}</Badge>
                  </TabsTrigger>
                </TabsList>
                
                <div className="space-y-4">
                  {alarmasFiltradas.length > 0 ? (
                    alarmasFiltradas.map(alarma => (
                      <div key={alarma.id} className={`p-4 border rounded-md ${getBgColor(alarma.tipo)}`}>
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={getBadgeColor(alarma.estado)}>
                                {alarma.estado === 'activa' ? 'Activa' : 
                                 alarma.estado === 'reconocida' ? 'Reconocida' : 'Resuelta'}
                              </Badge>
                              <span className="text-sm text-gray-500">{alarma.id}</span>
                            </div>
                            <div className="font-medium text-lg">{alarma.titulo}</div>
                            <div className="text-gray-600 mb-2">{alarma.descripcion}</div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>{alarma.componente}</span>
                              <span>•</span>
                              <span>{new Date(alarma.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="mt-3 md:mt-0 flex gap-2">
                            {alarma.estado === 'activa' && (
                              <Button size="sm" variant="outline" className="flex items-center gap-1">
                                <Bell className="h-4 w-4" />
                                <span>Reconocer</span>
                              </Button>
                            )}
                            {(alarma.estado === 'activa' || alarma.estado === 'reconocida') && (
                              <Button size="sm" variant="outline" className="flex items-center gap-1">
                                <CheckCircle className="h-4 w-4" />
                                <span>Resolver</span>
                              </Button>
                            )}
                            <Button size="sm" variant="outline">Detalles</Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-gray-500">
                      <AlertTriangle className="mx-auto h-12 w-12 mb-3 opacity-20" />
                      <p>No se encontraron alarmas con los filtros seleccionados.</p>
                    </div>
                  )}
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default AlarmasPage;
