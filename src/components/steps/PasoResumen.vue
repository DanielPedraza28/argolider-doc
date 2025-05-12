<template>
  <div class="p-4 border rounded bg-white">
    <h2 class="text-xl font-bold mb-6 text-center">Paso 7: Resumen Final</h2>

    <div class="space-y-10">
      <div v-for="(grupo, index) in resumenSecciones" :key="index">
        <h3 class="text-lg font-semibold border-b pb-1 mb-3">{{ grupo.titulo }}</h3>
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <li v-for="campo in grupo.campos" :key="campo.label">
            <strong>{{ campo.label }}:</strong>
            <span v-if="campo.tipo === 'archivo' && localData[campo.clave]">
              <a :href="localData[campo.clave]" target="_blank" class="text-blue-600 underline">Ver documento</a>
            </span>
            <span v-else>{{ localData[campo.clave] || '—' }}</span>
          </li>
        </ul>
      </div>

      <!-- Historial de Nombres -->
      <div v-if="localData.nombresAntiguos?.length">
        <h3 class="text-lg font-semibold border-b pb-1 mb-3">Historial de Nombres Antiguos</h3>
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <li v-for="(item, i) in localData.nombresAntiguos" :key="i">
            <strong>{{ item.nombre }}</strong> — hasta {{ item.anioHasta || '—' }}
          </li>
        </ul>
      </div>

      <!-- Imágenes -->
      <div v-if="localData.imagenes?.length">
        <h3 class="text-lg font-semibold border-b pb-1 mb-3">Imágenes del Predio</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="(img, i) in localData.imagenes"
            :key="i"
            class="border rounded overflow-hidden group relative"
          >
            <a :href="img" target="_blank">
              <img :src="img" class="w-full h-32 object-cover" />
            </a>
          </div>
        </div>
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
            { label: 'CHIP', clave: 'chip' },
            { label: 'Documento Matrícula', clave: 'documentoMatriculaInmobiliariaUrl', tipo: 'archivo' }
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
          titulo: 'Inventario',
          campos: [
            { label: 'Clase', clave: 'claseInventario' },
            { label: 'Fecha último', clave: 'fechaUltimoInventario' },
            { label: 'Documento Inventario', clave: 'documentoClaseInventarioUrl', tipo: 'archivo' }
          ]
        },
        {
          titulo: 'Estado Técnico',
          campos: [
            { label: 'Fecha Licencia Inicial', clave: 'fechaLicenciaInicial' },
            { label: 'Fecha Modificación', clave: 'fechaModificacion' },
            { label: 'Descripción Estado Licencia', clave: 'descripcionEstadoLicencia' },
            { label: 'Documento Técnico', clave: 'documentoEstadoTecnicoUrl', tipo: 'archivo' }
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
