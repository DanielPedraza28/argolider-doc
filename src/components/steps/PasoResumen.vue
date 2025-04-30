<template>
  <div class="p-4 border rounded bg-white">
    <h2 class="text-xl font-bold mb-6 text-center">Paso 10: Resumen Final</h2>

    <div class="space-y-8">
      <div v-for="(grupo, index) in resumenSecciones" :key="index">
        <h3 class="text-lg font-semibold border-b pb-1 mb-3">{{ grupo.titulo }}</h3>
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <li v-for="campo in grupo.campos" :key="campo.label">
            <strong>{{ campo.label }}:</strong> {{ localData[campo.clave] || '—' }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PasoResumen',
  props: ['modelValue'],
  computed: {
    localData() {
      return this.modelValue || {}
    },
    resumenSecciones() {
      return [
        {
          titulo: 'Identificación',
          campos: [
            { label: 'Número Interno', clave: 'numeroInterno' },
            { label: 'Nombre Propiedad', clave: 'nombrePropiedad' },
            { label: 'Tipo', clave: 'tipo' },
            { label: 'Dirección', clave: 'direccion' },
            { label: 'Ciudad', clave: 'ciudad' },
            { label: 'Matrícula', clave: 'matriculaInmobiliaria' },
            { label: 'CHIP', clave: 'chip' }
          ]
        },
        {
          titulo: 'Estado Administrativo',
          campos: [
            { label: 'Estado', clave: 'estado' },
            { label: 'Arrendatarios', clave: 'nombreArrendatarios' },
            { label: 'Canon', clave: 'canonArrendamiento' },
            { label: 'Área arrendada', clave: 'areaArrendada' },
            { label: 'Fecha Inicio', clave: 'fechaInicio' },
            { label: 'Fecha Terminación', clave: 'fechaTerminacion' },
            { label: 'N° Prórroga', clave: 'numeroProrroga' }
          ]
        },
        {
          titulo: 'Avalúo',
          campos: [
            { label: 'Catastral Actual', clave: 'avaluoCatastralActual' },
            { label: 'Catastral Anterior', clave: 'avaluoCatastralAnterior' },
            { label: 'Comercial Último', clave: 'avaluoComercialUltimo' },
            { label: 'Fecha Avalúo', clave: 'fechaAvaluoComercial' }
          ]
        },
        {
          titulo: 'Impuestos',
          campos: [
            { label: '¿Al día en valorización?', clave: 'validacionValorizacion' },
            { label: 'Fecha cálculo', clave: 'fechaCalculoImpuesto' },
            { label: 'Valor impuesto predial', clave: 'valorImpuestoPredial' },
            { label: 'Observaciones', clave: 'observacionesDeudaImpuestos' }
          ]
        },
        {
          titulo: 'Inventarios',
          campos: [
            { label: 'Clase', clave: 'claseInventario' },
            { label: 'Fecha último', clave: 'fechaUltimoInventario' }
          ]
        },
        {
          titulo: 'Estado Técnico',
          campos: [
            { label: 'Fecha Licencia Inicial', clave: 'fechaLicenciaInicial' },
            { label: 'Fecha Modificación', clave: 'fechaModificacion' },
            { label: 'Descripción Estado Licencia', clave: 'descripcionEstadoLicencia' }
          ]
        },
        {
          titulo: 'Ubicación geográfica',
          campos: [
            { label: 'Latitud', clave: 'latitud' },
            { label: 'Longitud', clave: 'longitud' }
          ]
        }
      ]
    }
  }
}
</script>
