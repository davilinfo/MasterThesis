using System.Threading.Tasks;

namespace Application.Interfaces
{
   public interface IProxyRestaurantSidechainNode
   {      
      Task<dynamic> GetSidechainNodeInfo();
      Task<dynamic> GetSidechainDelegates();
   }
}
