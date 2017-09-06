using Newtonsoft.Json;
using System;

namespace Kitchensink.Core.DotNetNuke.Base
{
    internal class SettingConfigDto
    {
        [JsonProperty("keyName")]
        public String KeyName { get; set; }
    }
}
