<template>
  <div class="overflow-y-auto max-h-[calc(100vh-120px)] px-4 py-8">
    <div class="max-w-6xl mx-auto space-y-8">
      <h2 class="text-2xl font-semibold text-center text-black mb-6">Detalle de ficha del predio</h2>

      <!-- Secciones -->
      <section
        v-for="(grupo, index) in secciones"
        :key="index"
        class="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
      >
        <h3 class="text-lg font-bold mb-3 flex items-center gap-2 text-black/90">
          <span>📁</span> {{ grupo.titulo }}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="campo in grupo.campos" :key="campo.label">
            <p class="text-sm text-gray-600 font-semibold">{{ campo.label }}</p>
            <p class="text-gray-800">{{ ficha[campo.clave] || '—' }}</p>
          </div>
        </div>
      </section>

      <!-- Coordenadas -->
      <section class="border border-blue-200 rounded-lg p-6 bg-blue-50">
        <h3 class="text-lg font-bold mb-3 flex items-center gap-2 text-blue-900">
          <span>🗺️</span> Ubicación geográfica
        </h3>
        <div class="flex flex-wrap items-center gap-6">
          <div>
            <p class="text-sm text-gray-600 font-semibold">Latitud</p>
            <p class="text-gray-800">{{ ficha.latitud || '—' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 font-semibold">Longitud</p>
            <p class="text-gray-800">{{ ficha.longitud || '—' }}</p>
          </div>
          <a
            v-if="ficha.latitud && ficha.longitud"
            class="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
            :href="`https://www.google.com/maps?q=${ficha.latitud},${ficha.longitud}`"
            target="_blank"
          >
            Ver en Google Maps
          </a>
        </div>
      </section>

      <!-- Historial de Nombres -->
      <section class="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        <h3 class="text-lg font-bold mb-3 flex items-center gap-2">
          <span>📜</span> Historial de Nombres
        </h3>
        <div v-if="ficha.nombresAntiguos?.length" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="(nombre, i) in ficha.nombresAntiguos"
            :key="i"
            class="border p-3 rounded shadow-sm bg-gray-50"
          >
            <p><strong>Nombre:</strong> {{ nombre.nombre }}</p>
            <p><strong>Hasta:</strong> {{ nombre.anioHasta }}</p>
          </div>
        </div>
        <p v-else class="text-gray-600">No hay nombres anteriores registrados.</p>
      </section>

      <!-- Imágenes -->
      <section class="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        <h3 class="text-lg font-bold mb-3 flex items-center gap-2">
          <span>🖼️</span> Imágenes del predio
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <img
            v-for="(img, i) in ficha.imagenes"
            :key="i"
            :src="img"
            alt="Imagen del predio"
            class="w-full h-40 object-cover border rounded-lg shadow"
          />
        </div>
        <p v-if="!ficha.imagenes?.length" class="text-gray-600">No hay imágenes registradas.</p>
      </section>

      <!-- Botón volver -->
      <div class="text-center">
        <button
          @click="$router.push('/fichas')"
          class="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          Volver al listado
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase/config'
import { doc, getDoc } from 'firebase/firestore'

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
