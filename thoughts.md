
## Problem Statement

An organization needs to have a view of their assets during any transformation restructuring activity so that they are able to be confident their transformation plans are comprehensive.

When reverse engineering the IT infrastructure it is very easy to develop a view that doesnt conform to the reality.

## Proposal

The proposal is to request information from staff about the IT assets but impose constraints on information gathered and provide feedback to staff when that the information provided does not translate into a consistent value stream.

Information to be gathered

Data
  Operating Cost
IP : Source Code or Vendor
  Operating Cost
Systems (Compute)
  Operating Cost

Applications
  Dependencies (Data,IP,Systems,Services)

Service  
  Dependencies (IP,Systems,Services)

Taxonomy
  Association(Category)
Category
  Associations(Category,Application,Service)

Use Case
  Value
  Dependencies (Applications,Services)

Constraints

Source Code IP must have repository identified to have value
Vendor IP must have product version identified to have value

Systems must be identified by name to have value.

Applications must have data, ip and systems to provide their value.
Services must have ip and systems to provide their value.

All dependencies must have value for an application,integration to have value
All dependencies must have value for a use case to have value.

Anything not connected to Use Case with value have no value.

## Information Gathering

Request SMEs to add in entities.
Present the information to them and do this in a way so they can see where there is no connected value stream.
When information is not connected to value stream, request for additional SME who might be able to add in missing information.
Email the SMEs and repeat the process.

## Risks

Use cases can be duplicates - mitigiated by
Applications can be duplicates or inconsistent - mitigated by making the population visible during creation.
Information cant be exported to be reorganized for planning purposes.

## Implementation

Define the schemas for the entities.
