# SAI API Messages

[![CI](https://github.com/janeirodigital/sai-impl-service/actions/workflows/ci.yml/badge.svg)](https://github.com/janeirodigital/sai-impl-service/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/janeirodigital/sai-impl-service/branch/main/graph/badge.svg?flag=api-messages)](https://codecov.io/gh/janeirodigital/sai-impl-service/tree/main/packages/api-messages)
[![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/solid/data-interoperability-panel)
[![MIT license](https://img.shields.io/github/license/janeirodigital/sai-impl-service)](https://github.com/janeirodigital/sai-impl-service/blob/main/LICENSE)

Interfaces used between the API handler of [SAI Authorization Agent Service](https://github.com/janeirodigital/sai-impl-service/tree/main/packages/service)
and a front end (e.g. [SAI Authorization Agent Web](https://github.com/janeirodigital/sai-impl-web))

## Features

### Applications

* Get all [Application Registrations](https://solid.github.io/data-interoperability-panel/specification/#application-registration) from the [Agent Registry](https://solid.github.io/data-interoperability-panel/specification/#ar-registry)
* Get all the data needed to authorize an application
  * [Access Need Group](https://solid.github.io/data-interoperability-panel/specification/#access-need-group) of the application, including [Access Descriptions](https://solid.github.io/data-interoperability-panel/specification/#access-descriptions) in a preferred language
  * [Shape Tree](https://shapetrees.org/TR/specification/), including [Shape Tree Description](https://shapetrees.org/TR/specification/#descriptions) in a preferred language.
* Authorize an application. Based on provided user input
  * crates an [Application Registration](https://solid.github.io/data-interoperability-panel/specification/#application-registration)
  * creates an [Access Authorization](https://solid.github.io/data-interoperability-panel/specification/#access-authorization)
  * generates [Access Grant](https://solid.github.io/data-interoperability-panel/specification/#access-grant) and adds it to the Application Registration.

### Social Agents

* Get all [Social Agent Registrations](https://solid.github.io/data-interoperability-panel/specification/#social-agent-registration) from the [Agent Registry](https://solid.github.io/data-interoperability-panel/specification/#ar-registry)
* Create new [Social Agent Registration](https://solid.github.io/data-interoperability-panel/specification/#social-agent-registration) in the [Agent Registry](https://solid.github.io/data-interoperability-panel/specification/#ar-registry). Including minimal annotations from the user.

### Data Registries

* Get all [Data Registries](https://solid.github.io/data-interoperability-panel/specification/#data-registry) with all their [Data Registrations](https://solid.github.io/data-interoperability-panel/specification/#data-registration). It does not include any [Data Instances](https://solid.github.io/data-interoperability-panel/specification/#data-instance) from those registrations.
