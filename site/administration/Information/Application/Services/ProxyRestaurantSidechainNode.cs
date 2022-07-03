using Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
   public class ProxyRestaurantSidechainNode : IProxy, IProxyRestaurantSidechainNode
   {
      private readonly string apiDelegates = "/api/delegates";
      private readonly string apiNodeInfo = "/api/node/info";
      public ProxyRestaurantSidechainNode(ILogger<IProxy> logger, IConfiguration configuration) : base(logger, configuration, configuration.GetSection("SidechainNode:Node1").Value)
      {
         logger.LogInformation("IProxyRestaurantSidechain request initiating");         
      }

      public async Task<dynamic> GetSidechainDelegates()
      {
         var result = await GetAsync<dynamic>(apiDelegates);

         return result;
      }

      public async Task<dynamic> GetSidechainNodeInfo()
      {
         var result = await GetAsync<dynamic>(apiNodeInfo);

         return result;
      }
   }
}
