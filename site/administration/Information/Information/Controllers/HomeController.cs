using Application.Interfaces;
using Information.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace Information.Controllers
{
   public class HomeController : Controller
   {
      private readonly ILogger<HomeController> _logger;
      private readonly IProxyRestaurantSidechainNode _proxyRestaurantSidechainNode;

      public HomeController(ILogger<HomeController> logger, IProxyRestaurantSidechainNode proxyRestaurantSidechainNode)
      {
         _logger = logger;
         _proxyRestaurantSidechainNode = proxyRestaurantSidechainNode;
      }

      [Route("")]
      [Route("{controller}/{action}/{id?}")]
      public async Task<IActionResult> Index(string id)
      {
         if (id == "1")
         {
            _logger.LogInformation("Retrieving sidechain node 1 information");
            var result = await _proxyRestaurantSidechainNode.GetSidechainNodeInfo();

            return View(result);
         }

         if (id == "2")
         {
            _logger.LogInformation("Retrieving sidechain delegates information");
            var result = await _proxyRestaurantSidechainNode.GetSidechainDelegates();

            return View(result);
         }

         return View();
      }

      public IActionResult Privacy()
      {
         return View();
      }

      [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
      public IActionResult Error()
      {
         return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
      }
   }
}
