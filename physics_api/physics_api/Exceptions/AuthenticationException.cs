// Solution 1: Créer votre propre classe AuthenticationException
// Créez ce fichier dans un dossier "Exceptions" ou directement dans votre namespace

using System;

namespace physics_api.Exceptions
{
    public class AuthenticationException : Exception
    {
        public AuthenticationException() : base() { }

        public AuthenticationException(string message) : base(message) { }

        public AuthenticationException(string message, Exception innerException)
            : base(message, innerException) { }
    }
}