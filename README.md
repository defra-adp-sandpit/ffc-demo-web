[![Known Vulnerabilities](https://snyk.io/test/github/DEFRA/ffc-demo-web/badge.svg?targetFile=package.json)](https://snyk.io/test/github/DEFRA/ffc-demo-web?targetFile=package.json)

# FFC Demo Service

Digital service mock to claim public money in the event property subsides into
mine shaft. This is the web front end for the application. It contains a
simple claim submission journey where user input data is cached in Redis. On
submission the data is pulled from Redis and passed to the message service.

## Prerequisites

- Access to an instance of an
[Azure Service Bus](https://docs.microsoft.com/en-us/azure/service-bus-messaging/)(ASB).
- Docker
- Docker Compose

Optional:
- Kubernetes
- Helm

### Azure Service Bus

This service depends on a valid Azure Service Bus connection string for
asynchronous communication.  The following environment variables need to be set
in any non-production (`!config.isProd`) environment before the Docker
container is started. When deployed into an appropriately configured AKS
cluster (where [AAD Pod Identity](https://github.com/Azure/aad-pod-identity) is
configured) the micro-service will use AAD Pod Identity through the manifests
for
[azure-identity](./helm/ffc-demo-claim-service/templates/azure-identity.yaml)
and
[azure-identity-binding](./helm/ffc-demo-claim-service/templates/azure-identity-binding.yaml).

| Name                   | Description                                                                                |
| ----                   | -----------                                                                                |
| MESSAGE_QUEUE_HOST     | Azure Service Bus hostname, e.g. `myservicebus.servicebus.windows.net`                     |
| MESSAGE_QUEUE_PASSWORD | Azure Service Bus SAS policy key                                                           |
| MESSAGE_QUEUE_USER     | Azure Service Bus SAS policy name, e.g. `RootManageSharedAccessKey`                        |

## Environment variables

The following environment variables are required by the application container.
Values for development are set in the Docker Compose configuration. Default
values for production-like deployments are set in the Helm chart and may be
overridden by build and release pipelines.

| Name                           | Description                               | Required  | Default            | Valid                       | Notes                                                                             |
| ----                           | -----------                               | :-------: | -------            | -----                       | -----                                                                             |
| APPINSIGHTS_CLOUDROLE          | Role used for filtering metrics           | no        |                    |                             | Set to `ffc-demo-web-local` in docker compose files                               |
| APPINSIGHTS_INSTRUMENTATIONKEY | Key for application insight               | no        |                    |                             | App insights only enabled if key is present. Note: Silently fails for invalid key |
| CACHE_NAME                     | Cache name                                | no        | redisCache         |                             |                                                                                   |
| CLAIM_QUEUE_ADDRESS            | claim queue name                          | no        |                    | claim                       |                                                                                   |
| COOKIE_PASSWORD                | Redis cookie password                     | yes       |                    |                             |                                                                                   |
| NODE_ENV                       | Node environment                          | no        | development        | development,test,production |                                                                                   |
| PORT                           | Port number                               | no        | 3000               |                             |                                                                                   |
| REDIS_HOSTNAME                 | Redis host                                | no        | localhost          |                             |                                                                                   |
| REDIS_PORT                     | Redis port                                | no        | 6379               |                             |                                                                                   |
| REST_CLIENT_TIMEOUT_IN_MILLIS  | Rest client timout                        | no        | 5000               |                             |                                                                                   |
| SESSION_TIMEOUT_IN_MINUTES     | Redis session timeout                     | no        | 30                 |                             |                                                                                   |
| STATIC_CACHE_TIMEOUT_IN_MILLIS | static file cache timeout                 | no        | 54000 (15 minutes) |                             |                                                                                   |

Running the integration tests locally requires access to ASB, this can be
achieved by setting the following environment variables:
`MESSAGE_QUEUE_HOST`, `MESSAGE_QUEUE_PASSWORD`, `MESSAGE_QUEUE_USER`.
`CLAIM_QUEUE_ADDRESS` must be set to a valid, developer specific queue that is
available on ASB e.g. `ffc-demo-claim-<initials>` where `<initials>` are the
initials of the developer.

## Test structure

The tests have been structured into subfolders of ./test as per the
[Microservice test approach and repository structure](https://eaflood.atlassian.net/wiki/spaces/FPS/pages/1845396477/Microservice+test+approach+and+repository+structure)

## How to run tests

A convenience script is provided to run automated tests in a containerised
environment. This will rebuild images before running tests via docker-compose,
using a combination of `docker-compose.yaml` and `docker-compose.test.yaml`.
The command given to `docker-compose run` may be customised by passing
arguments to the test script.

Examples:

```
# Run all tests
scripts/test

# Run tests with file watch
scripts/test -w
```

### Running ZAP scan

A docker-compose exists for running a
[ZAP Baseline Scan](https://www.zaproxy.org/docs/docker/baseline-scan/).
Primarily this will be run during CI. It can also be run locally via the
[zap](./scripts/zap) script.

### Running accessibility tests

A docker-compose exists for running an
[AXE](https://www.npmjs.com/package/@axe-core/cli).
Primarily this will be run during CI. It can also be run locally via the
[AXE](./scripts/axe) script.

### Running acceptance tests

See [README](./test/acceptance/README.md).

## Running the application

The application is designed to run in containerised environments, using Docker
Compose in development and Kubernetes in production.

- A Helm chart is provided for production deployments to Kubernetes.

### Build container image

Container images are built using Docker Compose, with the same images used to
run the service with either Docker Compose or Kubernetes.

When using the Docker Compose files in development the local `app` folder will
be mounted on top of the `app` folder within the Docker container, hiding the
CSS files that were generated during the Docker build.  For the site to render
correctly locally `npm run build` must be run on the host system.


By default, the start script will build (or rebuild) images so there will
rarely be a need to build images manually. However, this can be achieved
through the Docker Compose
[build](https://docs.docker.com/compose/reference/build/) command:

```
# Build container images
docker-compose build
```

### Start and stop the service

Use Docker Compose to run service locally.

`docker-compose up`

Additional Docker Compose files are provided for scenarios such as linking to
other running services.

Link to other services:
```
docker-compose -f docker-compose.yaml -f docker-compose.override.yaml -f docker-compose.link.yaml up
```

### Test the service

This service posts messages to an ASB message queue. Manual testing
involves creating claims using the web UI and inspecting the appropriate
message queue. The service can be started by running
`docker-compose up --build` whilst having set the required
[environment variables](#azure-service-bus) for the ASB to be connected to.

The messages can be inspected with a tool such as
[Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer) or
the Service Bus Explorer, available within
[Azure Portal](https://azure.microsoft.com/en-us/updates/sesrvice-bus-explorer/).

An example message:
```
{
  "claimId": "MINE123",
  "name": "Joe Bloggs",
  "propertyType": "business",
  "accessible": false,
  "dateOfSubsidence": "2019-07-26T09:54:19.622Z",
  "mineType": ["gold"],
  "email": "test@email.com"
}
```

#### Accessing the pod

The service is exposed via a Kubernetes ingress, which requires an ingress
controller to be running on the cluster. For example, the NGINX Ingress
Controller may be installed via Helm.  

Alternatively, a local port may be forwarded to the pod:

```
# Forward local port to the Kubernetes deployment
kubectl port-forward --namespace=ffc-demo deployment/ffc-demo-web 3000:3000
```

Once the port is forwarded or an ingress controller is installed, the service
can be accessed and tested in the same way as described in the
[Test the service](#test-the-service) section above.

#### Probes

The service has both an Http readiness probe and an Http liveness probe
configured to receive at the below end points.

Readiness: `/healthy`
Liveness: `/healthz`

## CI pipeline

This service uses the [FFC CI pipeline](https://github.com/DEFRA/ffc-jenkins-pipeline-library)

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT
LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and
applications when using this information.

> Contains public sector information licensed under the Open Government license
> v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her
Majesty's Stationery Office (HMSO) to enable information providers in the
public sector to license the use and re-use of their information under a common
open licence.

It is designed to encourage use and re-use of information freely and flexibly,
with only a few conditions.
