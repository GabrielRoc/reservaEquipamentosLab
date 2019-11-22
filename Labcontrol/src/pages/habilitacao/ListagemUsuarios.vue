<template>
  <a-spin :spinning = "loading">
    <a-row style = "margin-bottom: 30px;">
      <a-col :span = "16" :offset = "4" style = "text-align: center">
        <h1> Usuários </h1>
      </a-col>
    </a-row>

    <a-table :dataSource = "usuarios" :columns = "columns" :locale = "{ filterConfirm: 'Ok', filterReset: 'Resetar', emptyText: 'Nenhum Usuário Cadastrado' }">

      <span slot = "actions" slot-scope = "text, record">
        
        <a-tooltip v-if = "record.type !== 'a' && record.type !== 'S'" placement = "top">
          <template slot = "title">
            <span> Habilitar Usuário </span>
          </template>

          <a-tag @click = "habilitaUsuario(text)" color = "green" :key = "text" >
            <a-icon type = "up-circle" />
          </a-tag>

          <a-tooltip placement = "top">
          <template slot = "title">
            <span> Desabilitar Usuário </span>
          </template>

          <a-tag @click = "desabilitaUsuario(text)" color = "red" :key = "text" >
            <a-icon type = "down-circle" />
          </a-tag>
        </a-tooltip>

        </a-tooltip>
      </span>
      
      <a-icon slot = "filterIcon" slot-scope = "filtered" type = "search" :style = "{ color: filtered ? '#108ee9' : '#aaa' }" />
      
      <div slot = "filterDropdownRA" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
        <a-input
          ref = "raInput"
          placeholder = 'Buscar por RA...'
          :value = "selectedKeys[0]"
          @change = "e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter = "() => handleSearch('searchRA', selectedKeys, confirm)"
        />
        <a-button type = 'primary' @click = "() => handleSearch('searchRA', selectedKeys, confirm)"> Buscar </a-button>
        <a-button @click = "() => handleReset('searchRA', clearFilters)"> Resetar </a-button>
      </div>

      <div slot = "filterDropdownNome" slot-scope = "{ setSelectedKeys, selectedKeys, confirm, clearFilters }" class = 'custom-filter-dropdown'>
        <a-input
          ref = "nomeInput"
          placeholder = 'Buscar nome...'
          :value = "selectedKeys[0]"
          @change = "e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter = "() => handleSearch('searchNome', selectedKeys, confirm)"
        />
        <a-button type = 'primary' @click = "() => handleSearch('searchNome', selectedKeys, confirm)"> Buscar </a-button>
        <a-button @click = "() => handleReset('searchNome', clearFilters)"> Resetar </a-button>
      </div>

      <span slot = "statusTipo" slot-scope = "type">
        <a-tag v-if = "type == 'Comum'" color = "blue" :key = "type"> {{type}} </a-tag>
        <a-tag v-if = "type == 'admin'" color = "green" :key = "type"> {{type}} </a-tag>
        <a-tag v-if = "type == 'Supervisor'" color = "yellow" :key = "type"> {{type}} </a-tag>
      </span>

      <span slot = "flagTipo" slot-scope = "flag">
        <a-tag v-if = "flag == 'Habilitado'" color = "green" :key = "flag"> {{flag}} </a-tag>
        <a-tag v-if = "flag == 'Desabilitado'" color = "red" :key = "flag"> {{flag}} </a-tag>
      </span>
    </a-table>

  </a-spin>
</template>

<script>
  import firebaseApp from '../../firebase-controller.js'

  const db = firebaseApp.database()
  const auth = firebaseApp.auth()

  export default {
    data () {
      return {
        role: null,
        loading: true,
        usuarios: [],
        usuario: '',
        searchRA: '',
        searchNome: '',
        columns: [{
          title: 'RA',
          dataIndex: 'ra',
          key: 'ra',
          scopedSlots: {
            filterDropdown: 'filterDropdownRA',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) => record.ra.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.$refs.raInput.focus()
              })
            }
          }
        }, {
          title: 'Nome',
          dataIndex: 'nome',
          key: 'nome',
          scopedSlots: {
            filterDropdown: 'filterDropdownNome',
            filterIcon: 'filterIcon'
          },
          onFilter: (value, record) => record.nome.toLowerCase().includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              setTimeout(() => {
                this.$refs.nomeInput.focus()
              })
            }
          }
        }, {
          title: 'Curso',
          dataIndex: 'curso',
          key: 'curso',
          filters: this.populaFiltroCursos(),
          onFilter: (value, record) => record.curso === value
        }, {
          title: 'Tipo de Usuário',
          dataIndex: 'type',
          scopedSlots: { customRender: 'statusTipo' },
          key: 'type',
          filters: [{
            'text': 'Comum',
            'value': 'Comum'
          }, {
            'text': 'Supervisor',
            'value': 'Supervisor'
          }, {
            'text': 'admin',
            'value': 'admin'
          }],
          onFilter: (value, record) => record.type === value
        }, {
          title: 'Situação',
          dataIndex: 'flag',
          scopedSlots: { customRender: 'flagTipo' },
          key: 'flag',
          onFilter: (value, record) => record.flag === value
        }, {
          title: 'Ações',
          dataIndex: 'id',
          key: 'acoes',
          align: 'center',
          scopedSlots: { customRender: 'actions' }
        }]
      }
    },
    beforeMount: function () {
      let _this = this
      _this.loading = true

      db.ref('Usuarios').orderByChild('role').on('value', function (snapshot) {
        var desordenados = []
        _this.usuarios = []
        _this.loading = true

        snapshot.forEach(function (item) {
          if (auth.currentUser.uid !== item.key) {
            if (item.val().role === 'Comum') {
              _this.usuarios.push({
                'id': item.key,
                'ra': item.val().RA,
                'email': item.val().Email,
                'type': item.val().role,
                'nome': item.val().Nome + ' ' + item.val().Sobrenome,
                'curso': item.val().Curso,
                'flag': item.val().flag
              })
            } else {
              desordenados.push({
                'id': item.key,
                'ra': item.val().RA,
                'email': item.val().Email,
                'type': item.val().role,
                'nome': item.val().Nome + ' ' + item.val().Sobrenome,
                'curso': item.val().Curso,
                'flag': item.val().flag
              })
            }
          }
        })
        _this.usuarios = _this.usuarios.concat(desordenados)
        _this.loading = false
      })

      db.ref('Usuarios/' + auth.currentUser.uid + '/role').on('value', function (snapshot) {
        _this.loading = true
        _this.role = snapshot.val()
        _this.loading = false
      })
    },
    methods: {
      handleSearch (inputText, selectedKeys, confirm) {
        confirm()
        this[inputText] = selectedKeys[0]
      },
      handleReset (inputText, clearFilters) {
        clearFilters()
        this[inputText] = ''
      },
      populaFiltroCursos () {
        var cursos = []
        db.ref('Controle/Cursos').orderByKey().on('value', function (snapshot) {
          snapshot.forEach(function (item) {
            cursos.push({
              'text': item.key,
              'value': item.key
            })
          })
        })

        return cursos
      },
      habilitaUsuario (id) {
        this.usuario = this.usuarios[this.usuarios.map(function (u) { return u.id }).indexOf(id)]

        if (this.usuario.type === 'Comum') {
          db.ref('Usuarios').child(this.usuario.id).update({flag: 'Habilitado'}).then(() => {
            this.$notification.success({
              message: 'Yey!',
              description: 'Usuário habilitado com sucesso.'
            })
          }).catch(() => {
            this.$notification.error({
              message: 'Yey!',
              description: 'Falha ao habilitar Usuário ' + this.usuario.nome
            })
          })
        } else {
          this.$notification.warning({
            message: 'Opps..',
            description: 'Você não possui permissão para isso.'
          })
        }
      },
      desabilitaUsuario (id) {
        this.usuario = this.usuarios[this.usuarios.map(function (u) { return u.id }).indexOf(id)]

        if (this.usuario.type === 'Comum') {
          db.ref('Usuarios').child(this.usuario.id).update({flag: 'Desabilitado'}).then(() => {
            this.$notification.success({
              message: 'Yey!',
              description: 'Usuário desabilitado com sucesso.'
            })
          }).catch(() => {
            this.$notification.error({
              message: 'Yey!',
              description: 'Falha ao desabilitar Usuário ' + this.usuario.nome
            })
          })
        } else {
          this.$notification.warning({
            message: 'Opps..',
            description: 'Você não possui permissão para isso.'
          })
        }
      }
    }
  }
</script>

<style>
  .custom-filter-dropdown {
    padding: 8px;
    border-radius: 6px;
    background: #fff;
    box-shadow: 0 1px 6px rgba(0, 0, 0, .2);
  }

  .custom-filter-dropdown input {
    width: 130px;
    margin-right: 8px;
  }

  .custom-filter-dropdown button {
    margin-right: 8px;
  }

  .highlight {
    color: #f50;
  }
</style>

