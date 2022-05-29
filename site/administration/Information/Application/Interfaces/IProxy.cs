using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace Application.Interfaces
{
   public abstract class IProxy : IDisposable
   {
      private readonly ILogger<IProxy> _logger;
      private IConfiguration _configuration;
      private string _url;      
      private bool _addHttpClient = true;
      private HttpClient _httpClient;
      private static int _timeoutLimit=8;

      public IProxy(ILogger<IProxy> logger, IConfiguration configuration, string url)
      {
         _logger = logger;         
         _url = url;
         _configuration = configuration;
         _httpClient = new HttpClient();
      }

      public async Task<T> Post<T>(string recurso, object body)
      {         
         _httpClient.BaseAddress = new System.Uri(_url);
         _httpClient.Timeout = TimeSpan.FromSeconds(_timeoutLimit);
         var result = await _httpClient.PostAsync($"{recurso}", JsonContent.Create(body));

         var deserialized = await result.Content.ReadFromJsonAsync<T>();

         return deserialized;
      }

      public async Task<HttpStatusCode> PostAsync(string recurso, object body, IDictionary<string, string> header = null)
      {         
         var message = new HttpRequestMessage(HttpMethod.Post, recurso);
         message.Content = JsonContent.Create(body);
         if (header != null)
         {
            foreach (var keyValuePair in header)
            {
               message.Headers.Add(keyValuePair.Key, keyValuePair.Value);
            }
         }         
         _httpClient.BaseAddress = new System.Uri(_url);
         _httpClient.Timeout = TimeSpan.FromSeconds(_timeoutLimit);         

         var result = await _httpClient.SendAsync(message);

         return result.StatusCode;
      }

      public HttpStatusCode Post(string recurso, object body, IDictionary<string, string> header = null)
      {         
         var message = new HttpRequestMessage(HttpMethod.Post, recurso);
         message.Content = JsonContent.Create(body);
         if (header != null)
         {
            foreach (var keyValuePair in header)
            {
               message.Headers.Add(keyValuePair.Key, keyValuePair.Value);
            }
         }         
         _httpClient.BaseAddress = new System.Uri(_url);
         _httpClient.Timeout = TimeSpan.FromSeconds(_timeoutLimit);         

         var result = _httpClient.Send(message);

         return result.StatusCode;
      }

      public async Task<HttpStatusCode> PutAsync(string recurso, object body, IDictionary<string, string> header = null)
      {         
         var message = new HttpRequestMessage(HttpMethod.Put, recurso);
         message.Content = JsonContent.Create(body);
         if (header != null)
         {
            foreach (var keyValuePair in header)
            {
               message.Headers.Add(keyValuePair.Key, keyValuePair.Value);
            }
         }         
         _httpClient.BaseAddress = new System.Uri(_url);
         _httpClient.Timeout = TimeSpan.FromSeconds(_timeoutLimit);         

         var result = await _httpClient.SendAsync(message);

         return result.StatusCode;
      }

      public HttpStatusCode Put(string recurso, object body, IDictionary<string, string> header = null)
      {         
         var message = new HttpRequestMessage(HttpMethod.Put, recurso);
         message.Content = JsonContent.Create(body);
         if (header != null)
         {
            foreach (var keyValuePair in header)
            {
               message.Headers.Add(keyValuePair.Key, keyValuePair.Value);
            }
         }         
         _httpClient.BaseAddress = new System.Uri(_url);
         _httpClient.Timeout = TimeSpan.FromSeconds(_timeoutLimit);         

         var result = _httpClient.Send(message);

         return result.StatusCode;
      }

      public async Task<T> GetAsync<T>(string recurso)
      {         
         _httpClient.BaseAddress = new System.Uri(_url);
         _httpClient.Timeout = TimeSpan.FromSeconds(_timeoutLimit);
         var result = await _httpClient.GetAsync($"{recurso}");
         var deserialized = await result.Content.ReadFromJsonAsync<T>();

         return deserialized;
      }

      public T Get<T>(string recurso)
      {         
         _httpClient.BaseAddress = new System.Uri(_url);
         _httpClient.Timeout = TimeSpan.FromSeconds(_timeoutLimit);
         var result = _httpClient.GetAsync($"{recurso}");
         result.RunSynchronously();

         var deserialized = result.Result.Content.ReadFromJsonAsync<T>();
         deserialized.RunSynchronously();

         return deserialized.Result;
      }

      public async Task<HttpStatusCode> Delete(string recurso, object body, IDictionary<string, string> header = null)
      {
         var message = new HttpRequestMessage(HttpMethod.Delete, recurso);
         message.Content = JsonContent.Create(body);
         if (header != null)
         {
            foreach (var keyValuePair in header)
            {
               message.Headers.Add(keyValuePair.Key, keyValuePair.Value);
            }
         }
         
         _httpClient.BaseAddress = new System.Uri(_url);
         _httpClient.Timeout = TimeSpan.FromSeconds(_timeoutLimit);         

         var result = await _httpClient.SendAsync(message);

         return result.StatusCode;
      }

      public void Dispose()
      {
         _httpClient?.Dispose();
      }
   }
}
