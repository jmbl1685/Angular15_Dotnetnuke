using Newtonsoft.Json;

namespace Kitchensink.Core.DotNetNuke.Base
{
    public class ProfileDto
    {
        [JsonProperty("propertyName")]
        public string PropertyName { get; set; }
    }
}
