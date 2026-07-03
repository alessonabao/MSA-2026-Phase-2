using System;
using AutoMapper;
using backend.Models;

namespace backend.Core;

public class MappingProfiles : Profile
{
          public MappingProfiles()
          {
                    CreateMap<ClubActivity, ClubActivity>();
          }
}
