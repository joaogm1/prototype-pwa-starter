/**
 * CONFIGURAÇÃO DO CAPACITOR
 * 
 * Este arquivo configura o Capacitor para transformar a aplicação web
 * em um aplicativo nativo para iOS e Android.
 * 
 * O Capacitor permite que você rode o app em dispositivos móveis
 * mantendo o código React.
 */

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // ID único do app (deve ser único na App Store / Play Store)
  appId: 'app.lovable.humanizapp',
  
  // Nome do aplicativo
  appName: 'HumanizApp',
  
  // Pasta onde fica o build da aplicação (npm run build)
  webDir: 'dist',
  
  // Configuração do servidor (para desenvolvimento)
  server: {
    // URL do preview da aplicação (permite testar em dispositivo físico)
    // Durante desenvolvimento, isso permite que o app mobile acesse o servidor de desenvolvimento
    url: 'https://3587ed03-57cb-43de-8e6a-e085f1c08c8f.lovableproject.com?forceHideBadge=true',
    
    // Permite conexões HTTP não seguras (apenas para desenvolvimento)
    cleartext: true
  },

  // Configurações específicas para iOS
  ios: {
    // Scheme usado para deep linking
    scheme: 'HumanizApp'
  },

  // Configurações específicas para Android
  android: {
    // Permite conexões HTTP não seguras no Android (apenas para desenvolvimento)
    allowMixedContent: true
  }
};

export default config;
