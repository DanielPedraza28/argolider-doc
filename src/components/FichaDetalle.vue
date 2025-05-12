<template>
  <div class="overflow-y-auto px-6 py-6 bg-gray-50 text-black">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-3xl font-bold">📄 Ficha Técnica del Predio</h2>
      <div class="flex items-center gap-4">
        <button
          @click="$router.push('/fichas')"
          class="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          Volver al listado
        </button>
        <button
          @click="exportarPDF"
          class="bg-white text-black border border-black px-6 py-2 rounded hover:bg-gray-100"
        >
          Exportar PDF
        </button>
      </div>
    </div>

    <!-- CONTENIDO PARA EXPORTAR -->
    <div ref="contenidoPDF" class="space-y-10">

      <!-- Secciones generales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="grupo in secciones"
          :key="grupo.titulo"
          class="bg-white border rounded-lg shadow-sm p-5 space-y-2"
        >
          <h3 class="text-lg font-semibold border-b pb-1 mb-2">{{ grupo.titulo }}</h3>
          <div v-for="campo in grupo.campos" :key="campo.label" class="text-sm">
            <p class="font-semibold text-gray-600">{{ campo.label }}</p>
            <p class="text-gray-800">{{ ficha[campo.clave] || '—' }}</p>
          </div>
        </div>
      </div>

      <!-- Ubicación -->
      <div class="bg-white border rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold border-b pb-1 mb-4">🗺️ Ubicación Geográfica</h3>
        <div class="flex flex-wrap items-center gap-6">
          <div>
            <p class="text-sm font-semibold text-gray-600">Latitud</p>
            <p class="text-gray-800">{{ ficha.latitud || '—' }}</p>
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-600">Longitud</p>
            <p class="text-gray-800">{{ ficha.longitud || '—' }}</p>
          </div>
          <a
            v-if="ficha.latitud && ficha.longitud"
            class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
            :href="`https://www.google.com/maps?q=${ficha.latitud},${ficha.longitud}`"
            target="_blank"
          >
            Ver en Google Maps
          </a>
        </div>
      </div>

      <!-- Nombres antiguos -->
      <div class="bg-white border rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold border-b pb-1 mb-4">📜 Historial de Nombres</h3>
        <div v-if="ficha.nombresAntiguos?.length" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="(nombre, i) in ficha.nombresAntiguos"
            :key="i"
            class="bg-gray-50 border rounded p-4"
          >
            <p><strong>Nombre:</strong> {{ nombre.nombre }}</p>
            <p><strong>Hasta:</strong> {{ nombre.anioHasta }}</p>
          </div>
        </div>
        <p v-else class="text-gray-600">No hay nombres anteriores registrados.</p>
      </div>

      <!-- Imágenes -->
      <div class="bg-white border rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold border-b pb-1 mb-4">🖼️ Imágenes del Predio</h3>
        <div v-if="ficha.imagenes?.length" class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            v-for="(img, i) in ficha.imagenes"
            :key="i"
            :href="img"
            target="_blank"
            class="block border rounded overflow-hidden"
          >
            <img :src="img" class="w-full h-40 object-cover" />
          </a>
        </div>
        <p v-else class="text-gray-600">No hay imágenes registradas.</p>
      </div>

      <!-- Documentos -->
      <div class="bg-white border rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold border-b pb-1 mb-4">📎 Documentos Adjuntos</h3>
        <ul class="space-y-2 text-sm text-blue-700 underline">
          <li v-if="ficha.documentoMatriculaInmobiliariaUrl">
            <a :href="ficha.documentoMatriculaInmobiliariaUrl" target="_blank">📄 Matrícula Inmobiliaria</a>
          </li>
          <li v-if="ficha.documentoClaseInventarioUrl">
            <a :href="ficha.documentoClaseInventarioUrl" target="_blank">📄 Inventario</a>
          </li>
          <li v-if="ficha.documentoEstadoTecnicoUrl">
            <a :href="ficha.documentoEstadoTecnicoUrl" target="_blank">📄 Estado Técnico</a>
          </li>
          <li v-if="!ficha.documentoMatriculaInmobiliariaUrl && !ficha.documentoClaseInventarioUrl && !ficha.documentoEstadoTecnicoUrl">
            <span class="text-gray-600">No hay documentos cargados.</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import html2pdf from 'html2pdf.js'

export default {
  name: 'FichaDetalle',
  data() {
    return {
      ficha: {},
      secciones: [
        {
          titulo: 'Identificación',
          campos: [
            { label: 'Número Interno', clave: 'numeroInterno' },
            { label: 'Nombre Propiedad', clave: 'nombrePropiedad' },
            { label: 'Tipo', clave: 'tipo' },
            { label: 'Dirección', clave: 'direccion' },
            { label: 'Ciudad', clave: 'ciudad' },
            { label: 'Matrícula Inmobiliaria', clave: 'matriculaInmobiliaria' },
            { label: 'CHIP', clave: 'chip' }
          ]
        },
        {
          titulo: 'Estado Administrativo',
          campos: [
            { label: 'Estado', clave: 'estado' },
            { label: 'Arrendatarios', clave: 'nombreArrendatarios' },
            { label: 'Canon', clave: 'canonArrendamiento' },
            { label: 'Área Arrendada', clave: 'areaArrendada' },
            { label: 'Fecha Inicio', clave: 'fechaInicio' },
            { label: 'Fecha Terminación', clave: 'fechaTerminacion' },
            { label: 'Prórroga', clave: 'numeroProrroga' }
          ]
        },
        {
          titulo: 'Avalúo',
          campos: [
            { label: 'Avalúo Catastral Actual', clave: 'avaluoCatastralActual' },
            { label: 'Avalúo Catastral Anterior', clave: 'avaluoCatastralAnterior' },
            { label: 'Avalúo Comercial Último', clave: 'avaluoComercialUltimo' },
            { label: 'Fecha Avalúo Comercial', clave: 'fechaAvaluoComercial' }
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
          titulo: 'Servicios Públicos',
          campos: [
            { label: 'Energía - Proveedor', clave: 'energiaNombreProveedor' },
            { label: 'Agua - Proveedor', clave: 'aguaNombreProveedor' },
            { label: 'Gas - Proveedor', clave: 'gasNombreProveedor' }
          ]
        },
        {
          titulo: 'Inventarios',
          campos: [
            { label: 'Clase Inventario', clave: 'claseInventario' },
            { label: 'Fecha Último Inventario', clave: 'fechaUltimoInventario' }
          ]
        },
        {
          titulo: 'Estado Jurídico',
          campos: [
            { label: 'Tipo de Proceso', clave: 'tipoProceso' },
            { label: 'Descripción del Proceso', clave: 'descripcionProceso' }
          ]
        },
        {
          titulo: 'Estado Técnico',
          campos: [
            { label: 'Licencia Inicial', clave: 'fechaLicenciaInicial' },
            { label: 'Fecha Modificación', clave: 'fechaModificacion' },
            { label: 'Descripción Técnica', clave: 'descripcionEstadoLicencia' }
          ]
        }
      ]
    }
  },
  methods: {
    async exportarPDF() {
      const element = this.$refs.contenidoPDF
      const opt = {
        margin: 0.5,
        filename: `Ficha_${this.ficha.nombrePropiedad?.replace(/\s+/g, '_') || 'predio'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' } // 📄 Horizontal
      }
      html2pdf().set(opt).from(element).save()
    }
  },
  async mounted() {
    const fichaId = this.$route.params.id
    try {
      const docRef = doc(db, 'predios', fichaId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        this.ficha = docSnap.data()
      } else {
        alert('Ficha no encontrada.')
        this.$router.push('/fichas')
      }
    } catch (error) {
      console.error('Error al obtener la ficha:', error)
    }
  }
}
</script>
