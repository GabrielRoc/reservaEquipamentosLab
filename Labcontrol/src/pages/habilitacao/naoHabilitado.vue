<template>
  <a-modal :visible = "true" :footer = "null" :closable = "false" centered>
    <div class = "header">
      <h3> <b> LabControl </b> </h3>
      <span> Reserve equipamentos e espaços para as suas atividades com muito mais praticidade! </span>
    </div>
    
    <a-form layout = "vertical" :autoFormCreate = "(form) => { this.form = form }" @submit = "login">
      <a-row>
        <a-col :span = "24">
          <a-form-item fieldDecoratorId = "email" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }, { type: 'email', message: 'E-mail Inválido' }] }">
            <a-input placeholder = "Digite seu e-mail"> 
              <a-icon slot = "prefix" type = "mail" style = "color: 'rgba(0,0,0,.25)'" />
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span = "24">
          <a-form-item fieldDecoratorId = "password" :fieldDecoratorOptions = "{ rules: [{ required: true, message: 'Campo Obrigatório' }] }">
            <a-input :type = "visible ? 'text' : 'password'" placeholder = "Digite sua senha"> 
              <a-icon slot = "prefix" type = "lock" style = "color: 'rgba(0,0,0,.25)'" />

              <a-icon v-if = "visible" slot = "suffix" type = "eye-o" style = "color: 'rgba(0,0,0,.25)'; cursor: pointer;" @click = "toggleVisible" />
              <a-icon v-else slot = "suffix" type = "eye" style = "color: 'rgba(0,0,0,.25)';  cursor: pointer;" @click = "toggleVisible" />
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>

      <a-row style = "margin-bottom: 5px;">
        <a-button style = "width: 100%;" type = "primary" :loading = "loading" html-type = "submit"> Login </a-button>
      </a-row>

      <a-row class = "links">
        <a-col :span = "12" style = "text-align: left;">
          <router-link to = "/cadastro"> Fazer Cadastro </router-link>
        </a-col>

        <a-col :span = "12" style = "text-align: right;">
          <router-link to = "/RecuperarSenha"> Esqueci minha senha </router-link>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>