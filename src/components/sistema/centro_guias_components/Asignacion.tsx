import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  InputNumber,
  Card,
  Row,
  Col,
  notification,
  Spin,
  Typography,
  Divider,
  Space,
  Radio
} from 'antd';
import { SearchOutlined, SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';

const { Option } = Select;
const { Title, Text } = Typography;

// Definir interfaces
interface Aerolinea {
  id_aerolinea: number;
  nombre: string;
  codigo?: string;
  aerolineas_plantilla?: AerolineasPlantilla;
}

interface AerolineasPlantilla {
  id_aerolinea: number;
  costo_guia_valor?: number;
  combustible_valor?: number;
  seguridad_valor?: number;
  aux_calculo_valor?: number;
  otros_valor?: number;
  aux1_valor?: number;
  aux2_valor?: number;
  tarifa_rate?: number;
  pca?: number;
}

interface Destino {
  id_destino: number;
  nombre: string;
  codigo?: string;
}

interface Origen {
  id_origen: number;
  nombre: string;
  codigo?: string;
}

interface Producto {
  id_producto: number;
  nombre: string;
}

interface Consignatario {
  id_consignatario: number;
  nombre: string;
}

interface AgenciaIata {
  id_agencia_iata: number;
  nombre: string;
}

interface FormData {
  id_guia_madre: number;
  id_consignatario: number;
  id_producto: number;
  id_agencia_iata: number;
  id_destino_awb: number;
  id_destino_final_docs: number;
  pago: string;
  fecha_vuelo: moment.Moment;
  fecha_asignacion: moment.Moment;
  from1?: number;
  to1?: number;
  by1?: number;
  to2?: number;
  by2?: number;
  to3?: number;
  by3?: number;
  costo_guia_valor?: number;
  combustible_valor?: number;
  seguridad_valor?: number;
  tarifa_rate?: number;
  char_weight?: number;
  otros_valor?: number;
  form_a?: number;
  transport?: number;
  pca?: number;
  fitos?: number;
  termografo?: number;
  mca?: number;
}

const initialFormData: FormData = {
  id_guia_madre: 0,
  id_consignatario: 0,
  id_producto: 0,
  id_agencia_iata: 0,
  id_destino_awb: 0,
  id_destino_final_docs: 0,
  pago: 'PREPAID',
  fecha_vuelo: moment(),
  fecha_asignacion: moment(),
  costo_guia_valor: 0,
  combustible_valor: 0,
  seguridad_valor: 0,
  tarifa_rate: 0,
  char_weight: 0,
  otros_valor: 0,
  form_a: 0,
  transport: 0,
  pca: 0,
  fitos: 0,
  termografo: 0,
  mca: 0
};

const Asignaciones: React.FC = () => {
  // Estados para datos
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [aerolineas, setAerolineas] = useState<Aerolinea[]>([]);
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [origenes, setOrigenes] = useState<Origen[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [consignatarios, setConsignatarios] = useState<Consignatario[]>([]);
  const [agenciasIata, setAgenciasIata] = useState<AgenciaIata[]>([]);
  const [guiaMadre, setGuiaMadre] = useState<any>(null);

  // Estados para carga de datos
  const [loadingAerolineas, setLoadingAerolineas] = useState<boolean>(false);
  const [loadingDestinos, setLoadingDestinos] = useState<boolean>(false);
  const [loadingOrigenes, setLoadingOrigenes] = useState<boolean>(false);
  const [loadingProductos, setLoadingProductos] = useState<boolean>(false);
  const [loadingConsignatarios, setLoadingConsignatarios] = useState<boolean>(false);
  const [loadingAgenciasIata, setLoadingAgenciasIata] = useState<boolean>(false);
  const [loadingGuiaMadre, setLoadingGuiaMadre] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Para búsqueda de guías madre
  const [searchValue, setSearchValue] = useState<string>('');

  // Cargar datos necesarios al montar el componente
  useEffect(() => {
    fetchAerolineas();
    fetchDestinos();
    fetchOrigenes();
    fetchProductos();
    fetchConsignatarios();
    fetchAgenciasIata();
  }, []);

  // Funciones para obtener datos
  const fetchAerolineas = async () => {
    try {
      setLoadingAerolineas(true);
      const response = await axios.get('/api/v1/aerolineas');
      setAerolineas(response.data);
    } catch (error) {
      console.error('Error al cargar aerolíneas:', error);
      notification.error({
        message: 'Error',
        description: 'No se pudieron cargar las aerolíneas'
      });
    } finally {
      setLoadingAerolineas(false);
    }
  };

  const fetchDestinos = async () => {
    try {
      setLoadingDestinos(true);
      const response = await axios.get('/api/v1/destinos');
      setDestinos(response.data);
    } catch (error) {
      console.error('Error al cargar destinos:', error);
      notification.error({
        message: 'Error',
        description: 'No se pudieron cargar los destinos'
      });
    } finally {
      setLoadingDestinos(false);
    }
  };

  const fetchOrigenes = async () => {
    try {
      setLoadingOrigenes(true);
      const response = await axios.get('/api/v1/origenes');
      setOrigenes(response.data);
    } catch (error) {
      console.error('Error al cargar orígenes:', error);
      notification.error({
        message: 'Error',
        description: 'No se pudieron cargar los orígenes'
      });
    } finally {
      setLoadingOrigenes(false);
    }
  };

  const fetchProductos = async () => {
    try {
      setLoadingProductos(true);
      const response = await axios.get('/api/v1/productos');
      setProductos(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      notification.error({
        message: 'Error',
        description: 'No se pudieron cargar los productos'
      });
    } finally {
      setLoadingProductos(false);
    }
  };

  const fetchConsignatarios = async () => {
    try {
      setLoadingConsignatarios(true);
      const response = await axios.get('/api/v1/consignatarios');
      setConsignatarios(response.data);
    } catch (error) {
      console.error('Error al cargar consignatarios:', error);
      notification.error({
        message: 'Error',
        description: 'No se pudieron cargar los consignatarios'
      });
    } finally {
      setLoadingConsignatarios(false);
    }
  };

  const fetchAgenciasIata = async () => {
    try {
      setLoadingAgenciasIata(true);
      const response = await axios.get('/api/v1/agencias-iata');
      setAgenciasIata(response.data);
    } catch (error) {
      console.error('Error al cargar agencias IATA:', error);
      notification.error({
        message: 'Error',
        description: 'No se pudieron cargar las agencias IATA'
      });
    } finally {
      setLoadingAgenciasIata(false);
    }
  };

  // Buscar guía madre
  const searchGuiaMadre = async () => {
    if (!searchValue) {
      notification.warning({
        message: 'Advertencia',
        description: 'Por favor ingrese un número de guía madre'
      });
      return;
    }

    try {
      setLoadingGuiaMadre(true);
      const response = await axios.get(`/api/v1/guias-madre/${searchValue}`);
      setGuiaMadre(response.data);

      // Actualizar el formulario con los datos de la guía madre
      if (response.data) {
        setFormData({
          ...formData,
          id_guia_madre: response.data.id_guia_madre,
        });
      } else {
        notification.warning({
          message: 'No encontrada',
          description: 'No se encontró la guía madre'
        });
      }
    } catch (error) {
      console.error('Error al buscar guía madre:', error);
      notification.error({
        message: 'Error',
        description: 'Error al buscar la guía madre'
      });
    } finally {
      setLoadingGuiaMadre(false);
    }
  };

  // Manejar cambios en los campos del formulario
  const handleFormChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Manejar cambio de aerolínea para cargar valores de plantilla
  const handleAerolineaChange = (value: number, field: 'by1' | 'by2' | 'by3') => {
    const selectedAerolinea = aerolineas.find(a => a.id_aerolinea === value);

    if (selectedAerolinea?.aerolineas_plantilla) {
      const plantilla = selectedAerolinea.aerolineas_plantilla;
      setFormData({
        ...formData,
        [field]: value,
        // Solo establecer estos valores si es by1 o si no están ya establecidos
        ...(field === 'by1' && {
          costo_guia_valor: plantilla.costo_guia_valor || formData.costo_guia_valor,
          combustible_valor: plantilla.combustible_valor || formData.combustible_valor,
          seguridad_valor: plantilla.seguridad_valor || formData.seguridad_valor,
          tarifa_rate: plantilla.tarifa_rate || formData.tarifa_rate,
          pca: plantilla.pca || formData.pca
        })
      });
    } else {
      setFormData({
        ...formData,
        [field]: value
      });
    }
  };

  // Enviar formulario
  const handleSubmit = async () => {
    if (!formData.id_guia_madre) {
      notification.warning({
        message: 'Advertencia',
        description: 'Por favor seleccione una guía madre'
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Preparar datos para enviar
      const dataToSubmit = {
        ...formData,
        fecha_vuelo: formData.fecha_vuelo.format('YYYY-MM-DD'),
        fecha_asignacion: formData.fecha_asignacion.format('YYYY-MM-DD')
      };

      // Eliminar campos que no están en el modelo (si hubiera alguno)
      delete (dataToSubmit as any).busqueda_guias_madres;

      const response = await axios.post('/api/v1/asignacion', dataToSubmit);

      notification.success({
        message: 'Éxito',
        description: 'Asignación creada correctamente'
      });

      // Limpiar formulario o redirigir
      resetForm();

    } catch (error) {
      console.error('Error al crear asignación:', error);
      notification.error({
        message: 'Error',
        description: 'No se pudo crear la asignación'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData(initialFormData);
    setGuiaMadre(null);
    setSearchValue('');
  };

  return (
    <div className="asignaciones-container">
      <Card title="Crear Asignación" bordered={false}>
        <Form layout="vertical">
          {/* Búsqueda de Guía Madre */}
          <Row gutter={16}>
            <Col span={12}>
              <Card title="Búsqueda de Guía Madre" size="small">
                <Space>
                  <Input
                    placeholder="Número de Guía Madre"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{ width: 200 }}
                  />
                  <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={searchGuiaMadre}
                    loading={loadingGuiaMadre}
                  >
                    Buscar
                  </Button>
                </Space>

                {guiaMadre && (
                  <div style={{ marginTop: 16 }}>
                    <Text strong>Guía Madre encontrada:</Text>
                    <p>ID: {guiaMadre.id_guia_madre}</p>
                    <p>Número: {guiaMadre.numero}</p>
                    {/* Mostrar otros detalles de la guía madre */}
                  </div>
                )}
              </Card>
            </Col>
          </Row>

          <Divider orientation="left">Información de la Asignación</Divider>

          {/* Campos principales */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Consignatario" required>
                <Select
                  value={formData.id_consignatario || undefined}
                  onChange={(value) => handleFormChange('id_consignatario', value)}
                  loading={loadingConsignatarios}
                  placeholder="Seleccionar consignatario"
                >
                  {consignatarios.map(c => (
                    <Option key={c.id_consignatario} value={c.id_consignatario}>
                      {c.nombre}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Producto" required>
                <Select
                  value={formData.id_producto || undefined}
                  onChange={(value) => handleFormChange('id_producto', value)}
                  loading={loadingProductos}
                  placeholder="Seleccionar producto"
                >
                  {productos.map(p => (
                    <Option key={p.id_producto} value={p.id_producto}>
                      {p.nombre}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Agencia IATA" required>
                <Select
                  value={formData.id_agencia_iata || undefined}
                  onChange={(value) => handleFormChange('id_agencia_iata', value)}
                  loading={loadingAgenciasIata}
                  placeholder="Seleccionar agencia IATA"
                >
                  {agenciasIata.map(a => (
                    <Option key={a.id_agencia_iata} value={a.id_agencia_iata}>
                      {a.nombre}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Destino AWB" required>
                <Select
                  value={formData.id_destino_awb || undefined}
                  onChange={(value) => handleFormChange('id_destino_awb', value)}
                  loading={loadingDestinos}
                  placeholder="Seleccionar destino AWB"
                >
                  {destinos.map(d => (
                    <Option key={d.id_destino} value={d.id_destino}>
                      {d.nombre} {d.codigo ? `(${d.codigo})` : ''}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Destino Final Docs" required>
                <Select
                  value={formData.id_destino_final_docs || undefined}
                  onChange={(value) => handleFormChange('id_destino_final_docs', value)}
                  loading={loadingDestinos}
                  placeholder="Seleccionar destino final docs"
                >
                  {destinos.map(d => (
                    <Option key={d.id_destino} value={d.id_destino}>
                      {d.nombre} {d.codigo ? `(${d.codigo})` : ''}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Tipo de Pago" required>
                <Radio.Group
                  value={formData.pago}
                  onChange={(e) => handleFormChange('pago', e.target.value)}
                >
                  <Radio.Button value="PREPAID">PREPAID</Radio.Button>
                  <Radio.Button value="COLLECT">COLLECT</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Fecha de Vuelo" required>
                <DatePicker
                  value={formData.fecha_vuelo}
                  onChange={(value) => handleFormChange('fecha_vuelo', value)}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Fecha de Asignación" required>
                <DatePicker
                  value={formData.fecha_asignacion}
                  onChange={(value) => handleFormChange('fecha_asignacion', value)}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Rutas</Divider>

          {/* Ruta 1 */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Origen">
                <Select
                  value={formData.from1 || undefined}
                  onChange={(value) => handleFormChange('from1', value)}
                  loading={loadingOrigenes}
                  placeholder="Seleccionar origen"
                >
                  {origenes.map(o => (
                    <Option key={o.id_origen} value={o.id_origen}>
                      {o.nombre} {o.codigo ? `(${o.codigo})` : ''}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Destino 1">
                <Select
                  value={formData.to1 || undefined}
                  onChange={(value) => handleFormChange('to1', value)}
                  loading={loadingDestinos}
                  placeholder="Seleccionar destino"
                >
                  {destinos.map(d => (
                    <Option key={d.id_destino} value={d.id_destino}>
                      {d.nombre} {d.codigo ? `(${d.codigo})` : ''}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Aerolínea 1">
                <Select
                  value={formData.by1 || undefined}
                  onChange={(value) => handleAerolineaChange(value, 'by1')}
                  loading={loadingAerolineas}
                  placeholder="Seleccionar aerolínea"
                >
                  {aerolineas.map(a => (
                    <Option key={a.id_aerolinea} value={a.id_aerolinea}>
                      {a.nombre} {a.codigo ? `(${a.codigo})` : ''}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Ruta 2 */}
          <Row gutter={16}>
            <Col span={8}>
              {/* Origen no necesario para ruta 2 */}
            </Col>

            <Col span={8}>
              <Form.Item label="Destino 2">
                <Select
                  value={formData.to2 || undefined}
                  onChange={(value) => handleFormChange('to2', value)}
                  loading={loadingDestinos}
                  placeholder="Seleccionar destino"
                >
                  {destinos.map(d => (
                    <Option key={d.id_destino} value={d.id_destino}>
                      {d.nombre} {d.codigo ? `(${d.codigo})` : ''}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Aerolínea 2">
                <Select
                  value={formData.by2 || undefined}
                  onChange={(value) => handleAerolineaChange(value, 'by2')}
                  loading={loadingAerolineas}
                  placeholder="Seleccionar aerolínea"
                >
                  {aerolineas.map(a => (
                    <Option key={a.id_aerolinea} value={a.id_aerolinea}>
                      {a.nombre} {a.codigo ? `(${a.codigo})` : ''}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Ruta 3 */}
          <Row gutter={16}>
            <Col span={8}>
              {/* Origen no necesario para ruta 3 */}
            </Col>

            <Col span={8}>
              <Form.Item label="Destino 3">
                <Select
                  value={formData.to3 || undefined}
                  onChange={(value) => handleFormChange('to3', value)}
                  loading={loadingDestinos}
                  placeholder="Seleccionar destino"
                >
                  {destinos.map(d => (
                    <Option key={d.id_destino} value={d.id_destino}>
                      {d.nombre} {d.codigo ? `(${d.codigo})` : ''}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Aerolínea 3">
                <Select
                  value={formData.by3 || undefined}
                  onChange={(value) => handleAerolineaChange(value, 'by3')}
                  loading={loadingAerolineas}
                  placeholder="Seleccionar aerolínea"
                >
                  {aerolineas.map(a => (
                    <Option key={a.id_aerolinea} value={a.id_aerolinea}>
                      {a.nombre} {a.codigo ? `(${a.codigo})` : ''}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">Valores</Divider>

          {/* Valores */}
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="Costo Guía">
                <InputNumber
                  value={formData.costo_guia_valor}
                  onChange={(value) => handleFormChange('costo_guia_valor', value)}
                  min={0}
                  precision={2}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="Combustible">
                <InputNumber
                  value={formData.combustible_valor}
                  onChange={(value) => handleFormChange('combustible_valor', value)}
                  min={0}
                  precision={2}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="Seguridad">
                <InputNumber
                  value={formData.seguridad_valor}
                  onChange={(value) => handleFormChange('seguridad_valor', value)}
                  min={0}
                  precision={2}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="Otros">
                <InputNumber
                  value={formData.otros_valor}
                  onChange={(value) => handleFormChange('otros_valor', value)}
                  min={0}
                  precision={2}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="Tarifa Rate">
                <InputNumber
                  value={formData.tarifa_rate}
                  onChange={(value) => handleFormChange('tarifa_rate', value)}
                  min={0}
                  precision={2}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="Char Weight">
                <InputNumber
                  value={formData.char_weight}
                  onChange={(value) => handleFormChange('char_weight', value)}
                  min={0}
                  precision={2}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="PCA">
                <InputNumber
                  value={formData.pca}
                  onChange={(value) => handleFormChange('pca', value)}
                  min={0}
                  precision={2}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="Form A">
                <InputNumber
                  value={formData.form_a}
                  onChange={(value) => handleFormChange('form_a', value)}
                  min={0}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="Transport">
                <InputNumber
                  value={formData.transport}
                  onChange={(value) => handleFormChange('transport', value)}
                  min={0}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="Fitos">
                <InputNumber
                  value={formData.fitos}
                  onChange={(value) => handleFormChange('fitos', value)}
                  min={0}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item label="Termógrafo">
                <InputNumber
                  value={formData.termografo}
                  onChange={(value) => handleFormChange('termografo', value)}
                  min={0}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="MCA">
                <InputNumber
                  value={formData.mca}
                  onChange={(value) => handleFormChange('mca', value)}
                  min={0}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Botones de acción */}
          <Divider />

          <Row gutter={16} justify="end">
            <Col>
              <Button
                onClick={resetForm}
                icon={<ReloadOutlined />}
              >
                Limpiar
              </Button>
            </Col>
            <Col>
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={isSubmitting}
                icon={<SaveOutlined />}
                disabled={!formData.id_guia_madre}
              >
                Guardar
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default Asignaciones;