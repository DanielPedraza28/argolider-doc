<template>
  <div class="p-4 border rounded bg-white">
    <h2 class="text-xl font-bold mb-6 text-center">Paso 8: Estado Técnico</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Fecha Licencia Inicial -->
      <div>
        <label class="block mb-1 font-medium">Fecha Licencia Inicial</label>
        <input v-model="localData.fechaLicenciaInicial" type="date" class="w-full p-2 border rounded" />
      </div>

      <!-- Fecha Modificación -->
      <div>
        <label class="block mb-1 font-medium">Fecha Modificación</label>
        <input v-model="localData.fechaModificacion" type="date" class="w-full p-2 border rounded" />
      </div>

      <!-- Descripción y documento asociado -->
      <div class="md:col-span-2">
        <label class="block mb-1 font-medium">Descripción de estado de licencia y/o modificación</label>
        <textarea v-model="localData.descripcionEstadoLicencia" rows="4" class="w-full p-2 border rounded"></textarea>

        <!-- Subida de documento -->
        <input
          v-if="!localData.documentoEstadoTecnicoUrl"
          type="file"
          accept="application/pdf"
          @change="handleArchivoEstadoTecnico"
          class="mt-2"
        />

        <!-- Documento cargado -->
        <div
          v-if="localData.documentoEstadoTecnicoUrl"
          class="mt-4 bg-gray-100 p-3 rounded shadow text-sm text-black"
        >
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 1.5a1 1 0 0 1 1 0l6 3A1 1 0 0 1 17 5v10a1 1 0 0 1-.553.894l-6 3a1 1 0 0 1-.894 0l-6-3A1 1 0 0 1 3 15V5a1 1 0 0 1 .553-.894l6-3zM10 11H9v4H8v-4H7v-1h3v1z" />
              </svg>
              <a
                :href="localData.documentoEstadoTecnicoUrl"
                target="_blank"
                class="text-black font-medium underline hover:text-gray-700"
              >
                Ver documento cargado
              </a>
            </div>
            <div class="flex items-center gap-4">
              <button
                class="text-sm text-gray-600 hover:text-black font-semibold underline"
                @click="triggerInputEstadoTecnico"
              >
                Reemplazar documento
              </button>
              <button
                class="text-sm text-red-600 hover:text-red-800 font-semibold underline"
                @click="eliminarArchivoEstadoTecnico"
              >
                Eliminar documento
              </button>
            </div>
          </div>
          <div class="ml-7 mt-1 text-gray-500 text-xs">
            {{ nombreArchivoEstadoTecnico }}
          </div>
          <input
            ref="inputArchivoEstadoTecnico"
            type="file"
            accept="application/pdf"
            class="hidden"
            @change="handleArchivoEstadoTecnico"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/firebase/config'

export default {
  name: 'PasoEstadoTecnico',
  props: ['modelValue'],
  computed: {
    localData: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    nombreArchivoEstadoTecnico() {
      const url = this.localData.documentoEstadoTecnicoUrl
      if (!url) return ''
      try {
        const decoded = decodeURIComponent(url)
        return decoded.substring(decoded.lastIndexOf('/') + 1).split('?')[0]
      } catch (e) {
        return 'Documento cargado'
      }
    }
  },
  methods: {
    triggerInputEstadoTecnico() {
      this.$refs.inputArchivoEstadoTecnico.click()
    },
    eliminarArchivoEstadoTecnico() {
      if (!this.localData.documentoEstadoTecnicoUrl) return
      const confirmar = confirm('¿Deseas eliminar el documento técnico cargado?')
      if (!confirmar) return
      this.$emit('archivoEliminado', this.localData.documentoEstadoTecnicoUrl)
      this.localData.documentoEstadoTecnicoUrl = ''
      this.$refs.inputArchivoEstadoTecnico.value = null
    },
    async handleArchivoEstadoTecnico(event) {
      const archivo = event.target.files[0]
      if (!archivo) return

      if (this.localData.documentoEstadoTecnicoUrl) {
        this.$emit('archivoEliminado', this.localData.documentoEstadoTecnicoUrl)
      }

      const ruta = `documentos/tecnico/${Date.now()}_${archivo.name}`
      const ref = storageRef(storage, ruta)

      try {
        await uploadBytes(ref, archivo)
        const url = await getDownloadURL(ref)
        this.localData.documentoEstadoTecnicoUrl = url
        this.$emit('archivoTemporal', url)
        console.log('✅ Documento técnico subido:', url)
      } catch (error) {
        console.error('❌ Error al subir documento:', error)
        alert('Error al subir el documento. Revisa la consola.')
      }
    }
  }
}
</script>
