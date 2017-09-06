using System;
using System.Collections.Generic;

namespace Kitchensink.Core.DotNetNuke.Base
{
    internal class CurrentUser
    {
        public String DisplayName { get; internal set; }

        public String Email { get; internal set; }

        public String FirstName { get; internal set; }

        public Boolean IsSuperUser { get; internal set; }

        public String LastName { get; internal set; }

        public Int32 PortalId { get; internal set; }

        public Int32 UserId { get; internal set; }

        public String UserName { get; internal set; }

        public List<String> Roles { get; internal set; }
    }
}
