# Przewodnik Instalacji

## Wymagania
1. Node.js (najlepiej LTS)
2. Python 3.x
3. Ollama
4. Repozytorium projektu

## Ustawienia Backend
1. **Klonowanie Repozytorium**  
   Skopiuj repozytorium na lokalny komputer:  
   ```bash  
   git clone https://github.com/Arktoss98/vik_3.0.git  
   cd vik_3.0/backend  
   ```  

2. **Instalacja Zależności**  
   Zainstaluj wszystkie zależności:  
   ```bash  
   npm install  
   ```  

3. **Konfiguracja Zmiennych Środowiskowych**  
   Skopiuj plik `.env.example` do `.env` i wprowadź odpowiednie ustawienia:  
   ```bash  
   cp .env.example .env  
   ```  

4. **Uruchomienie Backend**  
   Uruchom serwer backendowy:  
   ```bash  
   npm start  
   ``` 

## Ustawienia Frontend
1. **Przejdź do Katalogu Frontend**  
   ```bash  
   cd ../frontend  
   ```  

2. **Instalacja Zależności**  
   Zainstaluj wszystkie zależności:  
   ```bash  
   npm install  
   ```  

3. **Uruchomienie Frontend**  
   Uruchom aplikację frontendową:  
   ```bash  
   npm start  
   ```  

## Ustawienia Ollama
1. **Instalacja Ollama**  
   Postępuj zgodnie z instrukcjami na stronie [Ollama](https://ollama.com/docs) w celu zainstalowania Ollama.

2. **Konfiguracja Ollama**  
   Po zainstalowaniu Ollama, skonfiguruj swój model, wykonując:  
   ```bash  
   ollama create <model_name>  
   ```  

3. **Uruchomienie Ollama**  
   Uruchom Ollama, aby rozpocząć korzystanie z modelu:  
   ```bash  
   ollama run <model_name>  
   ```

## Gotowe!
Teraz możesz korzystać z aplikacji!