declare module 'https-localhost' {
    import { Server } from 'https';
  
    interface LocalhostOptions {
      key?: string;
      cert?: string;
      hosts?: string[];
    }
  
    function https(options?: LocalhostOptions): Promise<Server>;
  
    export = https;
  }
  